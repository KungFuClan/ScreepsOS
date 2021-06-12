import { ActionConstants } from "Creep/interfaces/CreepConstants";
import { CommonCreepHelper } from "common/Helpers/Common_CreepHelper";
import { CommonStructureHelper } from "common/Helpers/Common_StructureHelper";
import { CreepRepo } from "Repositories/CreepRepo";
import { ICreepRunner } from "Creep/interfaces/interfaces";
import { Logger } from "utils/Logger";
import { RoomRepo } from "Repositories/RoomRepo";
import {StringMap} from "common/interfaces";
import {ThreadState} from "OperatingSystem/interfaces";

export const DeckhandService: ICreepRunner = {

    *runRole (creepName: string): Generator {

        const EnergyTarget = "energyTarget";
        const UpgradeTarget = "upgradeTarget";
        const BuildTarget = "buildTarget";
        const cache: StringMap<RoomObject | null> = {}

        while(Game.creeps[creepName]) {

            let creep = Game.creeps[creepName].safe<Creep>();

            const working = CreepRepo.GetCreepWorkingStatus(creep);

            const energyLevel = creep.store.getUsedCapacity();

            let action: ActionConstants | undefined;
            let target: RoomObject | null;
            let range = 0;

            if(energyLevel > 0) {

                if(!cache[BuildTarget]) {
                    const closestSite = CommonCreepHelper.getClosestConstructionSite(creep);

                    if(!closestSite) {
                        yield ThreadState.RESUME;
                    } else {
                        cache[BuildTarget] = closestSite;
                    }
                }
                if(!action && cache[BuildTarget] !== undefined) {
                    CreepRepo.SetCreepMemoryTarget(creep, cache[BuildTarget]?.id);
                    range = 3;
                    action = ActionConstants.BUILD;
                }

                if(!cache[UpgradeTarget]) {

                    const controller = Game.rooms[creep.memory.targetRoom].controller;
                    if(!controller) {
                        yield ThreadState.RESUME;
                    } else {
                        cache[UpgradeTarget] = controller;
                    }
                }
                if(!action && cache[UpgradeTarget] !== undefined) {
                    CreepRepo.SetCreepMemoryTarget(creep, cache[UpgradeTarget]?.safe().id);
                    action = ActionConstants.UPGRADE;
                    range = 3;
                }

                creep = creep.safe();
                target = CreepRepo.GetCreepMemoryTarget(creep);

                if(!target || !action) {
                    yield ThreadState.SUSPEND;
                    continue;
                }

                const moved = CommonCreepHelper.MoveTo(creep, target, range);
                if(moved) {
                    yield ThreadState.SUSPEND;
                    continue;
                }

                CreepRepo.SetCreepWorkingStatus(creep, true);

                while(creep.store.energy > 0) {
                    CommonCreepHelper.PerformAction(creep, action, target);
                    yield ThreadState.SUSPEND;
                    creep = creep.safe();
                }

                CreepRepo.SetCreepWorkingStatus(creep, false);

                CreepRepo.SetCreepMemoryTarget(creep, undefined);

            }
            else {

                // #region Get Energy Target
                if(!cache[EnergyTarget] || CommonStructureHelper.UsedAmount(cache[EnergyTarget]!) < creep.store.getCapacity()) {

                    const newEnergyTarget = CommonCreepHelper.getClosestEnergyTarget(creep.safe());
                    if(!newEnergyTarget) {
                        yield ThreadState.RESUME;
                    } else {
                        cache[EnergyTarget] = newEnergyTarget;
                    }
                }

                if(!action && cache[EnergyTarget] !== undefined) {
                    CreepRepo.SetCreepMemoryTarget(creep.safe(), cache[EnergyTarget]?.safe().id);
                    range = 1;
                    action = ActionConstants.RETRIEVE;
                }
                // #endregion

                creep = creep.safe();
                target = CreepRepo.GetCreepMemoryTarget(creep);

                if(!target || !action) {
                    yield ThreadState.SUSPEND;
                    continue;
                }

                const moved = CommonCreepHelper.MoveTo(creep, target, range);
                if(moved) {
                    yield ThreadState.SUSPEND;
                    continue;
                }

                CommonCreepHelper.PerformAction(creep, ActionConstants.RETRIEVE, target);

                CreepRepo.SetCreepMemoryTarget(creep, undefined);

            }
            yield ThreadState.SUSPEND;
        }
    }
}

import { CommonCreepHelper } from "common/Helpers/Common_CreepHelper";
import { CreepRepo } from "Repositories/CreepRepo";
import { ICreepRunner } from "Creep/interfaces/interfaces";
import { Logger } from "utils/Logger";
import {StringMap} from "common/interfaces";
import {ThreadState} from "OperatingSystem/interfaces";

export const DeckhandService: ICreepRunner = {

    *runRole (creepName: string): Generator {

        const EnergyTarget = "energyTarget";
        const UpgradeTarget = "upgradeTarget";
        const cache: StringMap<RoomObject | null> = {}

        while(Game.creeps[creepName]) {

            const creep = Game.creeps[creepName].safe<Creep>();

            const working = CreepRepo.GetCreepWorkingStatus(creep);

            const energyLevel = creep.store.getUsedCapacity();

            if(energyLevel > 0) {

                if(!cache[UpgradeTarget]) {

                    const controller = Game.rooms[creep.memory.targetRoom].controller;

                    if(!controller) {
                        Logger.withPrefix('[DeckhandService]').error(`Assigned a target room with no controller: ${creep.name}`);
                        yield ThreadState.SUSPEND;
                        continue;
                    }

                    cache[UpgradeTarget] = controller;
                }

                const target: StructureController = cache[UpgradeTarget]!.safe();

                const moved = CommonCreepHelper.MoveTo(creep, target, 3);
                if(moved) {
                    yield ThreadState.SUSPEND;
                    continue;
                }

                CreepRepo.SetCreepWorkingStatus(creep, true);

                while(creep.store.energy > 0) {
                    creep.upgradeController(target);
                    yield ThreadState.SUSPEND;
                }

                CreepRepo.SetCreepWorkingStatus(creep, false);

                yield ThreadState.SUSPEND;
                continue;
            }
            else {

                // * Get Energy target loop
                if(!cache[EnergyTarget]) {

                    const newEnergyTarget = CommonCreepHelper.getClosestEnergyTarget(creep.safe());

                    if(!newEnergyTarget) {
                        yield ThreadState.SUSPEND;
                        continue;
                    }

                    cache[EnergyTarget] = newEnergyTarget;

                }

                const target = cache[EnergyTarget]!.safe();

                const moved = CommonCreepHelper.MoveTo(creep, target, 1);
                if(moved) {
                    yield ThreadState.SUSPEND;
                    continue;
                }

                // TODO handle withdrawing for other structures instead - ideally just mask this as a custom action
                creep.pickup(target as Resource);

                delete cache[EnergyTarget];

                yield ThreadState.SUSPEND;
                continue;

            }
        }
    }
}

import { ActionConstants } from "Creep/interfaces/CreepConstants";
import { CommonCreepHelper } from "common/Helpers/Common_CreepHelper";
import { CommonStructureHelper } from "common/Helpers/Common_StructureHelper";
import { CreepRepo } from "Repositories/CreepRepo";
import { ICreepRunner } from "Creep/interfaces/interfaces";
import { Logger } from "utils/Logger";
import { StringMap } from "common/interfaces";
import { ThreadState } from "OperatingSystem/interfaces";

export const TenderService: ICreepRunner = {

    *runRole (creepName: string): Generator {

        const EnergyTarget = "energyTarget";
        const StoreTarget = "storeTarget";
        const DropTarget = "dropTarget";
        const cache: StringMap<RoomObject | null> = {}

        CreepRepo.SetCreepWorkingStatus(Game.creeps[creepName], true);

        while(Game.creeps[creepName]) {

            let creep = Game.creeps[creepName].safe<Creep>();

            const energyLevel = creep.store.getUsedCapacity();

            let action: ActionConstants | undefined;
            let target: RoomObject | null = null;
            let range = 0;

            if(energyLevel > 0) {

                // #region Get Storage Target
                if(!cache[StoreTarget] || (cache[StoreTarget]?.safe() as StructureStorage).store.getFreeCapacity() === 0) {
                    const closestStruct = CommonCreepHelper.getClosestTargetToFill(creep.safe());
                    if(!closestStruct) {
                        yield ThreadState.RESUME;
                    } else {
                        cache[StoreTarget] = closestStruct;
                    }
                }

                if(!action && cache[StoreTarget] !== undefined) {
                    action = ActionConstants.FILL;
                    range = 1;
                    CreepRepo.SetCreepMemoryTarget(creep, cache[StoreTarget]!.id);
                }
                // #endregion

                // #region Get Drop Target
                if(!cache[DropTarget]) {
                    const closestSpawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);

                    if(!closestSpawn) {
                        yield ThreadState.RESUME;
                    } else {
                        cache[DropTarget] = closestSpawn;
                    }
                }

                if(!action && cache[DropTarget] !== undefined) {
                    action = ActionConstants.DROP;
                    range = 1;
                    CreepRepo.SetCreepMemoryTarget(creep, cache[DropTarget]!.id);
                }
                // #endregion

                creep = creep.safe();
                target = CreepRepo.GetCreepMemoryTarget(creep);

                Logger.withPrefix('[TenderService]').warn(`Cache: ${cache[StoreTarget]} || ${cache[DropTarget]}, action: ${action}, memoryTarget: ${CreepRepo.GetCreepMemoryTarget(creep)}`)

                if(!target || !action) {
                    yield ThreadState.SUSPEND;
                    continue;
                }


                const moved = CommonCreepHelper.MoveTo(creep, target, 1);
                if(moved) {
                    yield ThreadState.SUSPEND;
                    continue;
                }

                CommonCreepHelper.PerformAction(creep, action, target);

                CreepRepo.SetCreepMemoryTarget(creep, undefined);
            }
            else {

                // #region Get Energy Target
                if(cache[EnergyTarget] === undefined || CommonStructureHelper.UsedAmount(cache[EnergyTarget]!.safe()) < creep.store.getCapacity()) {
                    const newEnergyTarget = CommonCreepHelper.getClosestEnergyTarget(creep.safe());

                    if(!newEnergyTarget) {
                        yield ThreadState.RESUME;
                    } else {
                        cache[EnergyTarget] = newEnergyTarget;
                    }
                }

                if(!action && cache[EnergyTarget] !== undefined) {
                    action = ActionConstants.RETRIEVE;
                    range = 1;
                    CreepRepo.SetCreepMemoryTarget(creep.safe(), cache[EnergyTarget]?.id);
                }
                // #endregion

                Logger.withPrefix('[TenderService]').warn(`Cache: ${cache[EnergyTarget]}, action: ${action}, memoryTarget: ${CreepRepo.GetCreepMemoryTarget(creep)}`)

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

                CommonCreepHelper.PerformAction(creep, action, target);

                CreepRepo.SetCreepMemoryTarget(creep, undefined);
            }

            yield ThreadState.SUSPEND;
        }

    }
}

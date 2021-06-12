import { CommonCreepHelper } from "common/Helpers/Common_CreepHelper";
import { CreepRepo } from "Repositories/CreepRepo";
import { ICreepRunner } from "Creep/interfaces/interfaces";
import { Logger } from "utils/Logger";
import { StringMap } from "common/interfaces";
import { ThreadState } from "OperatingSystem/interfaces";

export const TenderService: ICreepRunner = {


    *runRole (creepName: string): Generator {

        const EnergyTarget = "energyTarget";
        const StoreTarget = "storeTarget";
        const cache: StringMap<RoomObject | null> = {}

        CreepRepo.SetCreepWorkingStatus(Game.creeps[creepName], true);

        while(Game.creeps[creepName]) {

            const creep = Game.creeps[creepName].safe<Creep>();

            const energyLevel = creep.store.getUsedCapacity();

            Logger.withPrefix('[TenderService]').debug(`Creep is in state: ${creep.name}, ${creep.memory.working}, ${cache[EnergyTarget]}, ${cache[StoreTarget]}`)


            if(creep.store.energy > 0) {

                if(!cache[StoreTarget]) {
                    const closestStruct = CommonCreepHelper.getClosestTargetToFill(creep.safe());
                    if(!closestStruct) {
                        yield ThreadState.SUSPEND;
                        continue;
                    }
                    cache[StoreTarget] = closestStruct;
                    Logger.withPrefix('[TenderService]').debug(`Target: ${closestStruct}`);

                }

                const target: AnyStoreStructure = cache[StoreTarget]!.safe();

                const moved = CommonCreepHelper.MoveTo(creep, target, 1);
                if(moved) {
                    yield ThreadState.SUSPEND;
                    continue;
                }

                if(((target.store as GenericStore).getFreeCapacity(RESOURCE_ENERGY) || 0 > 0)) {
                    creep.transfer(target, RESOURCE_ENERGY);
                } else {
                    creep.drop(RESOURCE_ENERGY);
                }

                delete cache[StoreTarget];

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
                    Logger.withPrefix('[TenderService]').debug(`CREEP MOVED: ${creep.name}`)
                    yield ThreadState.SUSPEND;
                    continue;
                }

                // TODO handle withdrawing for other structures instead - ideally just mask this as a custom action
                creep.pickup(target as Resource);

                delete cache[EnergyTarget]; // TODO memory?

                yield ThreadState.SUSPEND;
                continue;

            }
                // find the mining container to fill from
                // if near
                    // get energy from it
                // if not
                    // move to it
        }


        yield ThreadState.SUSPEND;
    }
}

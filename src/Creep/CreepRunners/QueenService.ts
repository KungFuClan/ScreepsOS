import { CreepRepo } from "Repositories/CreepRepo";
import { ICreepRunner } from "Creep/interfaces/interfaces";
import { StringMap } from "common/interfaces";
import { ThreadState } from "OperatingSystem/interfaces";

export const QueenService: ICreepRunner = {
    *runRole (creepName: string): Generator {

        const cache: StringMap<RoomObject | null> = {}

        while(Game.creeps[creepName]) {

            const creep = Game.creeps[creepName].safe<Creep>();

            const working = CreepRepo.GetCreepWorkingStatus(creep);
            const energyLevel = creep.store.getUsedCapacity();
            if(working && energyLevel === 0) {
                CreepRepo.SetCreepWorkingStatus(creep, false);
            }
            if(!working && energyLevel < 0) {
                CreepRepo.SetCreepWorkingStatus(creep, true);
            }

            if(working) {
                // find closest extension/spawn and set as target
                // if near to it
                    // fill extension
                    // get next extension
                    // if not near to it
                        // move to extension
                // if not
                    // move towards it
            }
            else {
                // find container/storage to fill from
                // if near
                    // get energy from it
                // if not
                    // move to it
            }


            yield ThreadState.SUSPEND;
        }
    }
}

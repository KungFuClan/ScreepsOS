import { CreepRepo } from "Repositories/CreepRepo";
import { ICreepRunner } from "Creep/interfaces/interfaces";
import { StringMap } from "common/interfaces";
import { ThreadState } from "OperatingSystem/interfaces";

export const TenderService: ICreepRunner = {
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
                // find storage/spawn
                // if near
                    // deposit/drop on ground
                // if not
                    // move to it
            }
            else {
                // find the mining container to fill from
                // if near
                    // get energy from it
                // if not
                    // move to it
            }


            yield ThreadState.SUSPEND;
        }
    }
}

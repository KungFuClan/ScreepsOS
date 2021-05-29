import { CreepRepo } from "Repositories/CreepRepo";
import { ICreepRunner } from "Creep/interfaces/interfaces";
import { MinerHelper } from "Creep/Helpers/MinerHelper";
import { RoomRepo } from "Repositories/RoomRepo";
import { StringMap } from "common/interfaces";
import { ThreadState } from "OperatingSystem/interfaces";

export const MinerService: ICreepRunner = {
    *runRole (creepName: string): Generator {

        const cache: StringMap<any> = {}

        while(Game.creeps[creepName]) {

            const creep = Game.creeps[creepName];
            let targetSource = CreepRepo.GetCreepMemoryTarget<Source>(creep);
            if(!targetSource) {
                const sources = RoomRepo.GetAllSources_ByRoom(creep.room.name);
                targetSource = MinerHelper.GetSourceWithLowestWorkSaturation(sources, creep.room.name);
                CreepRepo.SetCreepMemoryTarget(creep, targetSource.id);
            }

            let range;
            let moveTarget;

            if(!cache["miningContainer"]){
                cache["miningContainer"] = MinerHelper.GetMiningContainer(targetSource);
            }

            const miningContainer = cache["miningContainer"];
            if(miningContainer !== null) {
                range = 0;
                moveTarget = miningContainer;
            }
            else {
                range = 1;
                moveTarget = targetSource;
            }

            const working = CreepRepo.GetCreepWorkingStatus(creep);
            const inRangeOfMoveTarget = creep.pos.inRangeTo(moveTarget.pos, range);
            if(!working && inRangeOfMoveTarget) {
                CreepRepo.SetCreepWorkingStatus(creep, true);
            }
            if(working && !inRangeOfMoveTarget) {
                CreepRepo.SetCreepWorkingStatus(creep, false);
            }

            if(working) {
                creep.harvest(targetSource);
            }
            else {
                creep.moveTo(moveTarget);
            }

            yield ThreadState.SUSPEND;
        }

    }
}

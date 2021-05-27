import { CreepRepo } from "Repositories/CreepRepo";
import { ICreepRunner } from "Creep/interfaces/interfaces";
import { MinerHelper } from "Creep/Helpers/MinerHelper";
import { RoomRepo } from "Repositories/RoomRepo";
import { ThreadState } from "OperatingSystem/interfaces";

export const MinerService: ICreepRunner = {
    *runRole (creepName: string): Generator {

        const creep = Game.creeps[creepName];
        let targetSource = CreepRepo.GetCreepMemoryTarget<Source>(creep);
        if(!targetSource) {
            const sources = RoomRepo.GetAllSources_ByRoom(creep.room.name);
            targetSource = MinerHelper.GetSourceWithLowestWorkSaturation(sources, creep.room.name);
            CreepRepo.SetCreepMemoryTarget(creep, targetSource.id);
        }

        let range;
        let moveTarget;
        const miningContainer = MinerHelper.GetMiningContainer(targetSource);
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

        // flip bits
        // not working, in range -> working true
        // working, not in range -> flip false

        // do action
        // working, harvest source
        // not working, move to source

        yield ThreadState.SUSPEND;
    }
}

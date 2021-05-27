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

        yield ThreadState.SUSPEND;
    }
}

import { ICreepRunner } from "Creep/interfaces/interfaces";
import { MinerHelper } from "Creep/Helpers/MinerHelper";
import { RoomRepo } from "Repositories/RoomRepo";

export const MinerService: ICreepRunner = {
    *runRole (creepName: string): Generator {

        const creep = Game.creeps[creepName];
        const sources = RoomRepo.GetAllSources_ByRoom(creep.room.name);
        const targetSource = creep.pos.findClosestByRange(MinerHelper.GetSourceWithLowestWorkSaturation(sources, creep.room.name));

        yield true;
    }
}

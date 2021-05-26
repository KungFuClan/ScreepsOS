import { ICreepRunner } from "Creep/interfaces/interfaces";
import { RoomRepo } from "Repositories/RoomRepo";

export const MinerService: ICreepRunner = {
    *run (creepName: string): Generator {

        const creep = Game.creeps[creepName];
        const sources = RoomRepo.GetAllSources_ByRoom(creep.room.name);

        yield true;
    }
}

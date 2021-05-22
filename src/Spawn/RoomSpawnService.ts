import { IService } from "common/interfaces";
import { Thread } from "OperatingSystem/thread";
import { structureRepo } from "Repositories/StructureRepo";

export function * run (this: Thread<{roomName: string}> , roomName: string): Generator<unknown, any, unknown> {
    while(true) {

        if(Game.rooms[roomName] === undefined) {
            yield "RunSpawns could not find room " + roomName + ", destroying thread.";
            return;
        }

        const spawns = structureRepo.getStructure<StructureSpawn>(STRUCTURE_SPAWN, roomName);

        yield `${roomName} Spawn thread run, Spawns: ${spawns}`;
    }

}

import { Repos } from "Repositories/RepoController";
import { Thread } from "OperatingSystem/thread";

export function * run (this: Thread<{roomName: string}> , roomName: string): Generator<unknown, any, unknown> {
    while(true) {

        if(Game.rooms[roomName] === undefined) {
            yield "RunSpawns could not find room " + roomName + ", destroying thread.";
            return;
        }

        const spawns = Repos.structures.getStructure<StructureSpawn>(STRUCTURE_SPAWN, roomName);

        yield `${roomName} Spawn thread run, Spawns: ${spawns}`;
    }

}

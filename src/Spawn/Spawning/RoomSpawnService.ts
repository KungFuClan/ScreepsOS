import { SpawnQueueObject, spawnQueue } from "Spawn/SpawnQueue/SpawnQueue";

import { BodyPartsUtil } from "Spawn/BodyParts";
import { Thread } from "OperatingSystem/thread";
import { ThreadState } from "OperatingSystem/interfaces";
import { structureRepo } from "Repositories/StructureRepo";

export type runRoomParams = { roomName: string };

export function * runRoomSpawns (this: Thread<{roomName: string}> , roomName: string): Generator<unknown, any, unknown> {
    while(true) {

        if(Game.rooms[roomName] === undefined) {
            yield "RunSpawns could not find room " + roomName + ", destroying thread.";
            return;
        }

        const spawns = structureRepo.getStructure<StructureSpawn>(STRUCTURE_SPAWN, roomName);

        let energyAvailable = Game.rooms[roomName].energyAvailable;

        for(const spawn of spawns) {

            energyAvailable -= yield * runSpawn(spawn, energyAvailable);

            yield ThreadState.RESUME;
        }

        yield ThreadState.SUSPEND;
    }

}


function * runSpawn(spawn: StructureSpawn, energyAvailable: number): Generator<boolean, number, unknown> {

    let costToSpawn = 0;

    if(spawn.spawning) {
        return 0;
    }

    let reqToSpawn: SpawnQueueObject | undefined;
    for(const req of spawnQueue) {

        if(req.requestingRoom !== spawn.room.name) {
            continue;
        }

        costToSpawn = BodyPartsUtil.getPartsArrayCost(req.body)
        if(costToSpawn <= energyAvailable) {
            reqToSpawn = req;
        }
    }

    yield ThreadState.RESUME;

    // * This is where we would look for other room spawns to fill if we do not have one yet, then yield

    if(reqToSpawn === undefined) {
        return 0;
    }

    spawnQueue.delete(reqToSpawn);

    spawn.spawnCreep(reqToSpawn.body, `${reqToSpawn.role}${spawn.name}${Game.time.toString().slice(-4)}`, {memory: reqToSpawn.memory});

    return costToSpawn;
}

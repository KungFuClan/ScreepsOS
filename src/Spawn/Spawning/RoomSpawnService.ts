import { Priority, SpawnQueueObject } from "Spawn/interfaces";

import { BodyPartsUtil } from "Spawn/BodyParts";
import { Thread } from "OperatingSystem/thread";
import { ThreadState } from "OperatingSystem/interfaces";
import { spawnQueue } from "Spawn/SpawnQueue/SpawnQueue";
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

    const costToSpawn = 0;

    if(spawn.safe<StructureSpawn>().spawning) {
        return 0;
    }

    let reqToSpawn: SpawnQueueObject | undefined;

    for(let priority = 1; priority <= 3; priority++) {
        if(reqToSpawn === undefined) {
            reqToSpawn = getNextReqToSpawn(spawn.room.name, priority, energyAvailable);
            yield ThreadState.RESUME;
        }
    }

    if(reqToSpawn === undefined) {
        return 0;
    }

    spawnQueue.delete(reqToSpawn);

    spawn.safe<StructureSpawn>()
        .spawnCreep(reqToSpawn.body, `${reqToSpawn.role}${spawn.name}${Game.time.toString().slice(-4)}`, {memory: reqToSpawn.memory});

    return costToSpawn;
}

function getNextReqToSpawn(roomName: string, priority: Priority, energyAvailable: number): SpawnQueueObject | undefined {

    for(const req of spawnQueue) {

        if(req.requestingRoom !== roomName) continue;
        if(req.priority !== priority) continue;

        const costToSpawn = BodyPartsUtil.getPartsArrayCost(req.body)
        if(costToSpawn <= energyAvailable) {
            return req;
        }
    }

    return undefined;

}

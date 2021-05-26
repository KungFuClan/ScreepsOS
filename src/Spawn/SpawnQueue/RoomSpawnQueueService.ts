import { SpawnQueueObject, spawnQueue } from "./SpawnQueueController";

import { Thread } from "OperatingSystem/thread";

export type runRoomParams = { roomName: string };

export function * runRoomSpawnQueue(this: Thread<runRoomParams>, roomName: string): Generator<unknown, any, unknown> {
    while(true) {

        const creepName = 'testCreep';

        if(Game.creeps[creepName] === undefined) {
            const newSpawn: SpawnQueueObject = {
                creepRole: "test",
                requestingRoom: roomName,
                validator: undefined
            }

            if(!spawnQueue.has(creepName)) {
                spawnQueue.set(creepName, newSpawn);
                yield "Created spawn request";
                continue;
            }
        }

        yield `SpawnQueue_${roomName} did not submit spawn request.`;

    }
}

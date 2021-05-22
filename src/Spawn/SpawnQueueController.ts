import { EmpireRepo } from "Repositories/EmpireRepo";
import { Process } from "OperatingSystem/process";
import { Thread } from "OperatingSystem/thread";
import { kernel } from "OperatingSystem/kernel";

export interface SpawnQueueObject {
    creepRole: string,
    requestingRoom: string,
    validator: undefined | ((...args: any) => boolean)
}

type runRoomParams = { roomName: string };

kernel.createProcess('SpawnQueueController', run, {});

const spawnQueue = new Map<string,SpawnQueueObject>();

function * run(this: Thread): Generator<unknown, any, unknown> {

    while(true) {

        const ownedRooms = EmpireRepo.getRooms_My();

        for(const room of ownedRooms) {
            if(!this.process.hasThread(room.name)) {
                this.process.createThread<runRoomParams>(`queueManager_${room.name}`, runRoom, {roomName: room.name});
            }
        }

        yield;
        // yield * sleep(5);
    }

}

function * runRoom(this: Thread<runRoomParams>, roomName: string): Generator<unknown, any, unknown> {
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

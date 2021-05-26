import { runRoomParams, runRoomSpawnQueue } from "./RoomSpawnQueueService";
import { EmpireRepo } from "Repositories/EmpireRepo";
import { Thread } from "OperatingSystem/thread";
import { kernel } from "OperatingSystem/kernel";
import { sleep } from "OperatingSystem/loopScheduler";

export interface SpawnQueueObject {
    creepRole: string,
    requestingRoom: string,
    validator: undefined | ((...args: any) => boolean)
}

kernel.createProcess('SpawnQueueController', runSpawnQueueMain, {});

export const spawnQueue = new Map<string,SpawnQueueObject>();

function * runSpawnQueueMain(this: Thread): Generator<unknown, any, unknown> {

    while(true) {

        const ownedRooms = EmpireRepo.getRooms_My();

        for(const room of ownedRooms) {
            if(!this.process.hasThread(`queueManager_${room.name}`)) {
                this.process.createThread<runRoomParams>(`queueManager_${room.name}`, runRoomSpawnQueue, {roomName: room.name});
            }
        }

        yield * sleep(5);
    }

}



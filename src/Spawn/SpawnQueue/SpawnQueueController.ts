import { SpawnQueue, spawnQueue } from "./SpawnQueue";
import { runRoomParams, runRoomSpawnQueue } from "./RoomSpawnQueueService";

import { EmpireRepo } from "Repositories/EmpireRepo";
import { Logger } from "utils/Logger";
import { Thread } from "OperatingSystem/thread";
import { ThreadState } from "OperatingSystem/interfaces";
import { kernel } from "OperatingSystem/kernel";

kernel.createProcess('SpawnQueueController', runSpawnQueueMain, {});

function * runSpawnQueueMain(this: Thread): Generator<unknown, any, unknown> {

    while(true) {

        const ownedRooms = EmpireRepo.getRooms_My();

        for(const room of ownedRooms) {
            if(!this.process.hasThread(`queueManager_${room.name}`)) {
                this.process.createThread<runRoomParams>(`queueManager_${room.name}`, runRoomSpawnQueue, {roomName: room.name});
            }
        }

        Logger.withPrefix('[SpawnQueueController]').debug(`Next in Queue: ${JSON.stringify(spawnQueue.at(0))}\nTotal Queue Length: ${spawnQueue.length}`);

        yield ThreadState.SUSPEND;

        // yield * sleep(5);
    }

}



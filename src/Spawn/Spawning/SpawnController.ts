import { EmpireRepo } from 'Repositories/EmpireRepo';
import { Thread } from 'OperatingSystem/thread';
import { kernel } from 'OperatingSystem/kernel';
import { runRoomParams } from 'Spawn/SpawnQueue/RoomSpawnQueueService';
import { runRoomSpawn } from './RoomSpawnService';
import { sleep } from 'OperatingSystem/loopScheduler';


// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type SpawnControllerParams = {
    roomName: string;
}


kernel.createProcess('spawnController', runSpawnMain, {});

function * runSpawnMain(this: Thread<any>): Generator<unknown,any,unknown> {

    while(true) {

        const ownedRooms = EmpireRepo.getRooms_My();

        for(const room of ownedRooms) {
            if(!this.process.hasThread(room.name)) {
                this.process.createThread<runRoomParams>(`spawnManager_${room.name}`, runRoomSpawn, {roomName: room.name});
            }
        }

        yield * sleep(10);

    }
}

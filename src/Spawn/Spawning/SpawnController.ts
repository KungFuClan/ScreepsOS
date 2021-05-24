import { EmpireRepo } from 'Repositories/EmpireRepo';
import { run as RoomSpawnRun } from './RoomSpawnService';
import { Thread } from 'OperatingSystem/thread';
import { kernel } from 'OperatingSystem/kernel';
import { sleep } from 'OperatingSystem/loopScheduler';


// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type SpawnControllerParams = {
    roomName: string;
}

type runRoomParams = { roomName: string };

kernel.createProcess('spawnController', runMain, {});

function * runMain(this: Thread<any>): Generator<unknown,any,unknown> {

    while(true) {

        const ownedRooms = EmpireRepo.getRooms_My();

        for(const room of ownedRooms) {
            if(!this.process.hasThread(room.name)) {
                this.process.createThread<runRoomParams>(`spawnManager_${room.name}`, RoomSpawnRun, {roomName: room.name});
            }
        }

        yield * sleep(10);

    }
}

import { IController } from 'common/interfaces';
import { SpawnQueueService } from './SpawnQueueService';
import { kernel } from 'OperatingSystem/kernel';
import { Thread } from 'OperatingSystem/thread';
import { EmpireRepo } from 'Repositories/EmpireRepo';
import { sleep } from 'OperatingSystem/loopScheduler';
import { StructureRepo, structureRepo } from 'Repositories/StructureRepo';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type SpawnControllerParams = {
    roomName: string;
}

type runRoomParams = { roomName: string };

export class SpawnController extends IController {

    public static processName = 'spawnController';

    public static createProcess(): void {
        kernel.createProcess(this.processName, SpawnController.runMain, {});
    }

    public static * runMain(this: Thread<any>): Generator<unknown,any,unknown> {

        while(true) {

            if(!this.process.hasThread(SpawnQueueService.mainThreadName)) {
                this.process.createThread(SpawnQueueService.mainThreadName, SpawnQueueService.run, {});
            }

            const ownedRooms = EmpireRepo.getRooms_My();

            for(const room of ownedRooms) {
                if(!this.process.hasThread(room.name)) {
                    this.process.createThread<runRoomParams>(`spawnManager_${room.name}`, SpawnController.runRoom, {roomName: room.name});
                }
            }

            yield "Main thread run - sleeping 10 ticks";

            yield * sleep(10);

        }
    }

    public static * runRoom(roomName: string): Generator<unknown,any,unknown> {

        while(true) {

            const spawns = structureRepo.getStructure<StructureSpawn>(STRUCTURE_SPAWN, roomName);

            console.log("Spawns: " + spawns[0]);

            yield `${roomName} Spawn thread run`;

        }

    }
}

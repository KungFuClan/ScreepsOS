import { EmpireRepo } from "Repositories/EmpireRepo";
import { IService } from "common/interfaces";
import { Process } from "OperatingSystem/process";
import { Thread } from "OperatingSystem/thread";

export interface spawnQueueObject {
    creepRole: string,
    requestingRoom: string,
    validator: (...args: any) => boolean
}

export class SpawnQueueService extends IService{

    public static spawnQueue = new Set<spawnQueueObject>();

    public static * run(this: Thread): Generator<unknown, any, unknown> {

        const ownedRooms = EmpireRepo.getRooms_My();

        for(const room of ownedRooms) {
            if(!this.process.hasThread(room.name)) {
                this.process.createThread(room.name, SpawnQueueService.runRoom, {process: this.process, roomName: room.name});
            }
        }

        yield;

        let tempCount = 0;

        while(true) {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            yield "RunSpawnQueue: " + ++tempCount;
        }

    }

    public static * runRoom(process: Process, roomName: string): Generator<unknown, any, unknown> {
        while(true) {
            yield "Run Room SpawnQueue: " + roomName;
        }
    }
}

export const spawnQueueService = new SpawnQueueService();

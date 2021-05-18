import { IService } from "common/interfaces";
import { kernel } from "OperatingSystem/kernel";
import { Process } from "OperatingSystem/process";
import { EmpireRepo } from "Repositories/EmpireRepo";

export interface spawnQueueObject {
    creepRole: string,
    requestingRoom: string,
    validator: (...args: any) => boolean
}

export class SpawnQueueService implements IService{

    public spawnQueue: Set<spawnQueueObject>;

    public constructor() {
        this.spawnQueue = new Set();
    }

    public * run(process: Process): Generator<unknown, any, unknown> {

        const ownedRooms = EmpireRepo.getRooms_My();

        for(const room of ownedRooms) {
            if(!process.hasThread(room.name)) {
                process.createThread(room.name, this.runRoom, {process, roomName: room.name});
            }
        }

        yield;

        let tempCount = 0;

        while(true) {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            yield "RunSpawnQueue: " + ++tempCount;
        }

    }

    public * runRoom(process: Process, roomName: string): Generator<unknown, any, unknown> {
        while(true) {
            yield "Run Room SpawnQueue: " + roomName;
        }
    }
}

export const spawnQueueService = new SpawnQueueService();

import { EmpireRepo } from "Repositories/EmpireRepo";
import { IService } from "common/interfaces";
import { Thread } from "OperatingSystem/thread";
import { sleep } from "OperatingSystem/loopScheduler";
import { Process } from "OperatingSystem/process";

export interface SpawnQueueObject {
    creepRole: string,
    requestingRoom: string,
    validator: undefined | ((...args: any) => boolean)
}

type runRoomParams = { roomName: string };

export class SpawnQueueService extends IService{

    public static spawnQueue = new Set<SpawnQueueObject>();

    public static mainThreadName = "spawnQueueManager";

    public static initRoomQueues(process: Process): void {

        const ownedRooms = EmpireRepo.getRooms_My();

        for(const room of ownedRooms) {
            if(!process.hasThread(room.name)) {
                process.createThread<runRoomParams>(`queueManager_${room.name}`, SpawnQueueService.runRoom, {roomName: room.name});
            }
        }

    }

    public static * run(this: Thread): Generator<unknown, any, unknown> {


        SpawnQueueService.initRoomQueues(this.process);

        yield;

        while(true) {

            SpawnQueueService.spawnQueue.forEach(
                value => {
                    console.log("Spawn queue: " + JSON.stringify(value));
                }
            )

            yield;
            // yield * sleep(5);
        }

    }


    public static * runRoom(this: Thread<runRoomParams>, roomName: string): Generator<unknown, any, unknown> {
        while(true) {

            if(Game.creeps.testCreep === undefined) {
                const newSpawn: SpawnQueueObject = {
                    creepRole: "test",
                    requestingRoom: roomName,
                    validator: undefined
                }
                if( !SpawnQueueService.spawnQueue.has(newSpawn)) {
                    SpawnQueueService.spawnQueue.add(newSpawn);
                    yield "Created spawn request";
                    continue;
                }
            }

            yield `SpawnQueue_${roomName} did not submit spawn request.`;

        }
    }
}

export const spawnQueueService = new SpawnQueueService();

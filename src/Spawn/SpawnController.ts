import { IController } from 'common/interfaces';
import { Process } from 'OperatingSystem/process';
import { kernel } from 'OperatingSystem/kernel';
import { sleep  } from 'OperatingSystem/loopScheduler';
import { SpawnQueueService, spawnQueueService } from './SpawnQueueService';

export class SpawnController extends IController {

    public static processName = 'spawnController';

    public static createProcess(): void {
        kernel.createProcess(this.processName, this.runMain.bind(this), []);
    }

    public static * runMain(): Generator<unknown,any,unknown> {

        while(true) {

            let process = kernel.processes.get(this.processName);

            if(process === undefined) {
                process = kernel.processes.get(this.processName);
                yield;
                continue;
            }

            if(!process.hasThread('queueManager')) {
                process.createThread('queueManager', SpawnQueueService.run, [process]);
            }

            yield "Main thread run";

            // yield * sleep(10);

        }
    }

    public static * runRoom(roomName: string): Generator<unknown,any,unknown> {

        if(Game.rooms[roomName] === undefined) {
            console.log("RunSpawns could not find room " + roomName + ", destroying thread.");
            return;
        }

        while(true) {

            // TODO use repo
            const spawns = Game.rooms[roomName].find(FIND_MY_SPAWNS);

            if(spawns.length <= 0) {
                console.log(`${roomName} does not have any active spawns.`);
                yield * sleep(5);
                continue;
            }

        }

    }
}

import { IController } from 'common/interfaces';
import { kernel } from 'OperatingSystem/kernel';
import { sleep  } from 'OperatingSystem/loopScheduler';
import { Process } from 'OperatingSystem/process';
import { spawnQueueService } from './SpawnQueueService';

export class SpawnController implements IController {

    public processName = 'spawnController';

    public process: Process | undefined = undefined;

    public spawnQueue = [];

    public createProcess(): void {

        if(!kernel.hasProcess(this.processName)) {
            //* Create the main thread
            kernel.createProcess(this.processName, this.runMain, []);
        }

        this.process = kernel.processes.get(this.processName);
    }

    public * runMain(): Generator<unknown,any,unknown> {
        while(true) {

            if(!this.process?.hasThread('queueManager')) {
                this.process?.createThread('queueManager', spawnQueueService.run, [this.process]);
            }

            yield * sleep(10);

        }
    }

    public * runRoom(roomName: string): Generator<unknown,any,unknown> {

        if(Game.rooms[roomName] === undefined) {
            console.log("RunSpawns could not find room " + roomName + ", destroying thread.");
            return;
        }

        while(true) {

            const spawns = Game.rooms[roomName].find(FIND_MY_SPAWNS);

            if(spawns.length <= 0) {
                console.log(`${roomName} does not have any active spawns.`);
                yield * sleep(5);
                continue;
            }

        }

    }
}

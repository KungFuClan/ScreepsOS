import { IController } from 'common/interfaces';
import { kernel } from 'OperatingSystem/kernel';
import { SpawnQueueService } from './SpawnQueueService';

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

        yield;

    }
}

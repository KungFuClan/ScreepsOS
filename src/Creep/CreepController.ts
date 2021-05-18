import { IController } from "common/interfaces";
import { Process } from 'OperatingSystem/process';
import { kernel } from 'OperatingSystem/kernel';
import { sleep  } from 'OperatingSystem/loopScheduler';

export class CreepController implements IController {

    public processName = 'creepController'
    public process: Process | undefined = undefined;

    public createProcess() {
        if(!kernel.hasProcess(this.processName)) {
            //* Create the main thread
            kernel.createProcess(this.processName, this.runMain, []);
        }
        this.process = kernel.processes.get(this.processName);
    }

    public * runMain(): Generator<unknown,any,unknown> {

    }
}

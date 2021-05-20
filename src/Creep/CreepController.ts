import { IController } from "common/interfaces";
import { kernel } from 'OperatingSystem/kernel';
import { Thread } from "OperatingSystem/thread";

export class CreepController implements IController {

    public static processName = 'creepController'

    public static createProcess(): void {
        kernel.createProcess(this.processName, CreepController.runMain, {});
    }

    public static * runMain(this: Thread<any>): Generator<unknown,any,unknown>  {
        while(true) {
            // get my creeps -> civilian filter -> repo
            // loop over creeps
            // create thread assigned to creep service -> runCivCreeps

            yield "Running Creeps Completed";
        }
    }
}

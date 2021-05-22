import { Thread } from "OperatingSystem/thread";
import { kernel } from 'OperatingSystem/kernel';


const processName = 'creepController'

kernel.createProcess(processName, runMain, {});

function * runMain(this: Thread<any>): Generator<unknown,any,unknown>  {
    while(true) {
        // get my creeps -> civilian filter -> repo
        // loop over creeps
        // create thread assigned to creep service -> runCivCreeps

        yield "Running Creeps Completed";
    }
}

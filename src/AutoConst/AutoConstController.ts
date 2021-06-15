import { Logger } from "utils/Logger";
import { Thread } from "OperatingSystem/thread";
import { ThreadState } from "OperatingSystem/interfaces";
import { kernel } from 'OperatingSystem/kernel';

const processName = 'AutoConstController'
const _logger = new Logger(processName);

kernel.createProcess(processName, runCreepMain, {});

function * runCreepMain(this: Thread<any>): Generator<unknown,any,unknown>  {
    while(true) {
        // get fk't u thought this was a real push this is just baby talk right here
        // get all rooms?
        // one thread per room
            // inside that, one thread per structure type
            // check construction site limit, suspend if it's full to wait for next tick
            // get middle of room (same as last time, offset from default spawn saved in memory)
            // for 3x3, ez pz ofsets
            // rest of stuff unplanned atm

        yield ThreadState.SUSPEND;
    }
}

import * as _ from "lodash"

import { Thread, ThreadMap } from "./thread";
import { Process } from "./process";
import { StringMap } from "common/interfaces";

export interface LoopState {
    queue?: [string, Thread<any>][]
    currentName?: string | null;
}

export type LoopScheduler = Generator<unknown,any,unknown>

function createQueue(threads: ThreadMap<any>): [string, Thread<any>][] {
    // TODO Maybe swap this for a priority system
    // return _.shuffle(Array.from(threads.entries()));
    return Array.from(threads.entries());
}

export function * loopScheduler (threads: ThreadMap<any>, limit: number, state: LoopState = {}): LoopScheduler {
    const queue = createQueue(threads);
    state.queue = queue;

    const counts: StringMap<number> = {};
    const cpu: StringMap<number> = {};

    for(const item of queue) {
        state.currentName = item[0];

        try{
            const start = Game.cpu.getUsed();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const {value, done} = item[1].next();
            console.log(state.currentName + " Value: " + JSON.stringify(value));


            const duration = Game.cpu.getUsed() - start;

            counts[state.currentName] = counts[state.currentName] || 0;
            counts[state.currentName]++;
            cpu[state.currentName] = cpu[state.currentName] || 0;
            cpu[state.currentName] += duration;

            if(!done && value === true) {
                queue.push(item);
            }

            if(done) {
                threads.delete(state.currentName);
            }
        } catch (err) {
            threads.delete(state.currentName);
            // eslint-disable-next-line
            console.log(`Error Running thread: ${state.currentName} ${err.stack || err.message || err}`)
            yield state.currentName;
        }

        state.currentName = null;

        if(Game.cpu.getUsed() > limit) {
            const report = queue.slice(queue.indexOf(item))
                .map(i => [i[0], cpu[i[0]]])
                .filter(i => i[1] > 2)
                .map(([a, b]) => `${a}: ${b}`)

            console.log(report);
            return;
        }

        yield;
    }
}

export function * sleep (ticks: number): Generator<unknown, any, unknown> {
    const end = Game.time + ticks
    while (Game.time < end) yield
}

export function * restartThread(this: Thread, fn: GeneratorFunction, ...args: any[]): Generator<unknown, any, unknown>{
    while (true) {
        try {
            yield * fn.apply(this, args)
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            console.log(`Thread '${this.threadName}' exited with error: ${err}`)
        }
        yield
    }
}

// export function * watchdog<ParamType>(this: Process | Thread<any>, name: string, fn: GeneratorFunction, argsObj: ParamType): Generator<unknown, any, unknown> {
// while (true) {
//     if (!this.hasThread(name)) {
//     this.createThread(name, fn, argsObj);
//     }
//     yield
// }
// }

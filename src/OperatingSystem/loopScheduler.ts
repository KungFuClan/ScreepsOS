import * as _ from "lodash"

import { Process } from "./process";
import { StringMap } from "common/interfaces";
import { Thread, ThreadMap } from "./thread";
import { STATUS_CODES } from "http";

export interface LoopState {
    queue?: [string, Thread][]
    currentName?: string | null;
}

export type LoopScheduler = Generator<unknown,any,unknown>

function createQueue(threads: ThreadMap): [string, Thread][] {
    // TODO Maybe swap this for a priority system
    // return _.shuffle(Array.from(threads.entries()));
    return Array.from(threads.entries());
}

export function * loopScheduler (threads: ThreadMap, limit: number, state: LoopState = {}): LoopScheduler {
    const queue = createQueue(threads);
    state.queue = queue;

    for(const value of state.queue.entries()) {
        console.log("Queue: " + value[1][0]);
    }

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

            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            console.log(`Done? ${done} : Value: ${value}`);

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

export function * restartThread(this: Process | Thread, fn: GeneratorFunction, ...args: any[]): Generator<unknown, any, unknown>{
    while (true) {
        try {
            yield * fn.apply(this, args)
        } catch (err) {
            // eslint-disable-next-line
            console.log(`Thread '${this.name}' exited with error: ${err.stack || err.message || err}`)
        }
        yield
    }
}

  export function * watchdog(this: Process | Thread, name: string, fn: GeneratorFunction, ...args: any[]): Generator<unknown, any, unknown> {
    while (true) {
      if (!this.hasThread(name)) {
        this.createThread(name, fn, ...args)
      }
      yield
    }
  }

  export function * threadManager(this: Process | Thread, threads: Thread[], interval = 5): Generator<unknown, any, unknown> {
    interval = Math.max(interval, 1)
    while (true) {
      for (const [name, fn, ...args] of threads) {
        if (!this.hasThread(name)) {
          this.createThread(name, fn, ...args)
        }
      }
      yield* sleep(interval)
    }
  }

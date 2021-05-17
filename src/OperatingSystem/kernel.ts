import { GeneratorCreator } from "common/interfaces";
import { LoopScheduler, LoopState, loopScheduler } from "./loopScheduler";
import { Process, ProcessMap } from "./process";
import { Thread, ThreadMap } from "./thread";


export interface Kernel {
    threads: ThreadMap,
    processes: ProcessMap,
    pidGen: Generator<number, number, void>,
    startTick: number,
    schedulerState: LoopState
}

export class Kernel {

    public constructor() {
        this.threads = new Map<string, Thread>();
        this.processes = new Map<string, Process>();
        this.pidGen = calcCPUPID();
        this.startTick = Game.time;
    }

    private MIN_BUCKET = 1000;

    public tick (): void {
        if (Game.cpu.bucket < this.MIN_BUCKET) return;
        const { value: limit = 0 } = this.pidGen.next();
        this.schedulerState = {};

        const scheduler = loopScheduler(this.threads, limit, this.schedulerState);

        console.log("ticking kernel");

        for(const value of scheduler) {
            // eslint-disable-next-line
            console.log("SchedState: " + this.schedulerState);

            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            console.log("Scheduler Value: " + value)
            if(typeof value === 'string') {
                this.threads.delete(value);
            }
        }
    }

    public * [Symbol.iterator](): Generator<unknown, any, unknown> {
        while (true) {
            this.tick()
            yield
        }
    }

    public createThread(processName: string, threadName: string, fn: GeneratorCreator, ...args: any[]): void {
        const process = this.processes.get(processName);
        if(!process)
            throw new Error(`Tried creating thread ${threadName} for missing process ${processName}`);
        const thread = new Thread(process, threadName, fn, ...args);
        this.threads.set(thread.fullName, thread);
        if (this.schedulerState && this.schedulerState.queue) {
            this.schedulerState.queue.push([thread.fullName, thread]);
        }
    }

    public hasThread(threadName: string): boolean {
        return this.threads.has(threadName);
    }

    public destroyThread (threadName: string): boolean {
        // const thread = this.threads.get(threadName)
        return this.threads.delete(threadName)
    }

    public hasProcess (processName: string): boolean {
        return this.processes.has(processName);
    }

    public addProcess (processName: string, process: Process): void {
        this.processes.set(processName, process);
    }

    public createProcess(processName: string, fn: GeneratorCreator, ...args:any[]): void {
        const process = new Process(this, processName);
        this.addProcess(processName, process);
        process.createThread('main', fn, ...args);
    }

    public destroyProcess (processName: string): boolean {
        const process = this.processes.get(processName);
        process?.kill();
        return this.processes.delete(processName);
    }
}

//* The Kernel object used in the main loop
export const kernel = new Kernel();

export function * PID (Kp: number, Ki: number, Kd: number, Mi: number) : Generator<number, number, number> {
    let e = 0;
    let i = 0;
    let v = 0;
    while (true) {
        const le = e
        e = yield v
        i = i + e
        i = Math.min(Math.max(i, -Mi), Mi)
        const Up = (Kp * e)
        const Ui = (Ki * i)
        const Ud = Kd * (e / le) * e
        v = Up + Ui + Ud
    }
}

function * calcCPUPID () : Generator<number, number, void> {
  const Kp = 0.020;
  const Ki = 0.01;
  const Kd = 0;
  const Mi = 1000;
  const Se = 0.01;
  const pid = PID(Kp, Ki, Kd, Mi);
  while (true) {
    const { value } = pid.next(Se * (Game.cpu.bucket - 9500))
    const minLimit = Math.max(15, Game.cpu.limit * 0.2)
    const limit = Math.max(Game.cpu.limit + value - Game.cpu.getUsed(), minLimit)
    // console.table({e, i, Up, Ui, output, bucket: Game.cpu.bucket, limit})
    yield limit || minLimit
  }
}

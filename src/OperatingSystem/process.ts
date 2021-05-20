import { GeneratorCreator } from "common/interfaces";
import { Kernel } from "./kernel";

export interface ProcessMemory {
    temp?: string
}

export type ProcessMap = Map<string, Process>;

export class Process{

    public kernel: Kernel;
    public name: string;
    public memory: ProcessMemory;
    public threads: Set<string>;

    public constructor(kernel: Kernel, processName: string) {
        this.kernel = kernel;
        this.name = processName;
        this.memory = {};
        this.threads = new Set<string>();
    }

    public createThread<ParamType = any>(threadName: string, fn: GeneratorCreator, argObj: ParamType): void {
        this.threads.add(threadName);
        return this.kernel.createThread<ParamType>(this.name, threadName, fn, argObj);
    }

    public destroyThread (threadName: string): void {
        this.threads.delete(threadName);
    }

    public hasThread(threadName: string): boolean {
        return this.kernel.hasThread(`${this.name}:${threadName}`);
    }

    public kill(): void {
        for (const name of this.threads) {
            this.destroyThread(name);
        }
    }
}

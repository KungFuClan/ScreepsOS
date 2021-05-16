import { Kernel, kernel  } from "./kernel";
import { Thread } from "./thread";

export interface ProcessMemory {
    temp?: string
}

export interface Process {
    kernel: Kernel
    name: string,
    memory: ProcessMemory,
    threads: Set<string>
}

export type ProcessMap = Map<string, Process>;

export class Process {
    public constructor(processName: string) {
        this.kernel = kernel;
        this.name = processName;
        this.memory = {};
        this.threads = new Set<string>();
    }

    public createThread (threadName: string, fn: GeneratorFunction, ...args: any[]): void {
        this.threads.add(threadName);
        return this.kernel.createThread(this.name, threadName, fn, ...args);
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

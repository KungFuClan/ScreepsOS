import { Process, ProcessMemory } from "./process";

export interface Thread {
    name: string,
    process: Process,
    fullName: string,
    gen: Generator<any, any, any>
}

export type ThreadMap = Map<string, Thread>;

export class Thread {
    public constructor(process: Process, name: string, fn: GeneratorFunction, args = []) {
        this.name = "";
        this.process = process;
        this.fullName = `${process.name}:${name}`
        this.gen = fn.apply(this, args);
        Object.freeze(this);
    }

    public get memory(): ProcessMemory {
        return this.process.memory;
    }

    public next(): IteratorResult<any, any> {
        return this.gen.next();
    }

    public [Symbol.iterator](): Thread { return this }

    public createThread (threadName: string, fn: GeneratorFunction, ...args: any[]): void {
        return this.process.createThread(threadName, fn, ...args);
    }

    public destroyThread (threadName: string): void {
        return this.process.destroyThread(threadName);
    }

    public hasThread (threadName: string): boolean {
        return this.process.hasThread(threadName);
    }

    public killProcess(): void {
        return this.process.kill();
    }
}

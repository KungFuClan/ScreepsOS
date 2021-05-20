import { Process, ProcessMemory } from "./process";
import { GeneratorCreator } from "common/interfaces";

export type ThreadMap<ParamType> = Map<string, Thread<ParamType> >;

export class Thread<ParamType> {

    public threadName: string;
    public process: Process;
    public fullName: string;
    public gen: Generator<unknown, any, unknown>;

    public constructor(process: Process, name: string, fn: GeneratorCreator, argObj: ParamType) {
        const args = Object.values(argObj).length > 0 ? _.values(argObj) : [];
        this.threadName = "";
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

    public [Symbol.iterator](): Thread<ParamType> { return this }

    public createThread<ParamType>(threadName: string, fn: GeneratorFunction, argObj: ParamType): void {
        return this.process.createThread(threadName, fn, argObj);
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

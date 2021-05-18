import { Process } from "OperatingSystem/process";

export interface StringMap<T> {
    [key: string]: T
}

export type GeneratorCreator = (...args: any[]) => Generator;

export interface IController {
    processName: string,
    process: Process | undefined,
    createProcess: (...args: any[]) => void,
    runMain: GeneratorCreator
}

export interface IService {
    run: GeneratorCreator
}

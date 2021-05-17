export interface StringMap<T> {
    [key: string]: T
}

export type GeneratorCreator = (...args: any[]) => Generator;

export interface Controller {
    processName: string,
    createProcess: (...args: any[]) => void,
    runMain: GeneratorCreator
}

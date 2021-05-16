export interface StringMap<T> {
    [key: string]: T
}

export type GeneratorCreator = (...args: any[]) => Generator;

/* eslint-disable max-classes-per-file */
export interface StringMap<T> {
    [key: string]: T
}

export type GeneratorCreator = (...args: any[]) => Generator;

export abstract class IController {
    public static processName: string;

    public static runMain(): GeneratorCreator {
        throw new Error("Method not implemented.");
    }
}

export abstract class IService {
    public static run(): GeneratorCreator {
        throw new Error("Method not implemented.");
    }
}

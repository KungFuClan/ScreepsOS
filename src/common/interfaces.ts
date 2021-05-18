/* eslint-disable max-classes-per-file */
export interface StringMap<T> {
    [key: string]: T
}

export type GeneratorCreator = (...args: any[]) => Generator;

// export interface IController {
//     processName: string,
//     process: (Process | undefined),
//     runMain: GeneratorCreator
// }

export abstract class IController {
    public static processName: string;
    public static runMain: GeneratorCreator;
}

// export interface IService {
//     run: GeneratorCreator
// }

export abstract class IService {
    public static run: GeneratorCreator
}

/* eslint-disable max-classes-per-file */
export interface StringMap<T> {
    [key: string]: T
}

export type GeneratorCreator = (...args: any[]) => Generator;

export abstract class IController {
    public static processName: string;

    public static runMain: GeneratorCreator
}

export abstract class IService {
    public static mainThreadName: string;
    public static run: GeneratorCreator;
}

export const StoreStructures = StructureExtension
|| StructureFactory
|| StructureLab
|| StructureLink
|| StructureNuker
|| StructurePowerSpawn
|| StructureSpawn
|| StructureStorage
|| StructureTerminal
|| StructureTower
|| StructureContainer;

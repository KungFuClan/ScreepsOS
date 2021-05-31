import { RoleConstants } from "Creep/interfaces/CreepConstants";

export enum Priority {
    HIGH = 1,
    NORMAL = 2,
    LOW = 3
}

export interface SpawnQueueObject {
    role: RoleConstants,
    body: BodyPartConstant[],
    requestingRoom: string,
    memory: CreepMemory,
    priority: number,
    validator: undefined | ((...args: any) => boolean)
}

export interface SerializedSpawnQueueObject {
    role: RoleConstants,
    body: BodyPartConstant[],
    requestingRoom: string,
    memory: CreepMemory,
    priority: number
}

export type SpawningOptions = {
    offRoad?: boolean,
    energyTier?: EnergyTier,
    multiplyParts?: {
        [WORK]?: number,
        [MOVE]?: number,
        [CARRY]?: number,
        [CLAIM]?: number
        [ATTACK]?: number,
        [RANGED_ATTACK]?: number,
        [HEAL]?: number,
        [TOUGH]?: number,
    },
    addParts?: {
        [WORK]?: number,
        [MOVE]?: number,
        [CARRY]?: number,
        [CLAIM]?: number
        [ATTACK]?: number,
        [RANGED_ATTACK]?: number,
        [HEAL]?: number,
        [TOUGH]?: number,
    },
    priority?: Priority
}

export enum EnergyTier {
    T1 = 300,
    T2 = 550,
    T3 = 800,
    T4 = 1300,
    T5 = 1800,
    T6 = 2300,
    T7 = 5300,
    T8 = 12300
}

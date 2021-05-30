
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
    }
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

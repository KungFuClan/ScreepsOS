import { StringMap } from "common/interfaces";

/* eslint-disable camelcase */
export const CivilianCreeps: StringMap<boolean> = {
    // todo: find place to put role constants to avoid magic strings here
    'miner': true,
    'tender': true,
    'deckhand': true,
    'captian': true
}

// todo implement caching
export class CreepRepo {

    public static GetAllCreeps_My(): Creep[] {
        return _.map(Game.creeps, creep => creep);
    }

    public static GetAllCreeps_My_Civ(): Creep[] {
        return _.filter(this.GetAllCreeps_My(), (creep) => CivilianCreeps[creep.memory.role]);
    }
}

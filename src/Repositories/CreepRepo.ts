import { StringMap } from "common/interfaces";

/* eslint-disable camelcase */
export const CivilianCreeps: StringMap<boolean> = {
    // todo: find place to put role constants to avoid magic strings here
    'miner': true,
    'tender': true,
    'deckhand': true,
    'captian': true
}

export class CreepRepo {

    public static getAllCreeps_My(): Creep[] {
        return _.map(Game.creeps, creep => creep);
    }

    public static getAllCreeps_My_Civ(): Creep[] {
        return _.filter(this.getAllCreeps_My(), (creep) => CivilianCreeps[creep.memory.role]);
    }
}

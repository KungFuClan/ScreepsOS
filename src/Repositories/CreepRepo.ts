import { RoleConstants } from "Creep/interfaces/CreepConstants";
import { StringMap } from "common/interfaces";

export const CivilianCreeps: StringMap<boolean> = {
    [RoleConstants.MINER]: true,
    [RoleConstants.TENDER]: true,
    [RoleConstants.DECKHAND]: true,
    [RoleConstants.CAPTAIN]: true
}

// todo implement caching
export class CreepRepo {

    /**
     * Get all creeps in the empire
     * @returns Array of creeps
     */
    public static GetAllCreeps_My(): Creep[] {
        return _.map(Game.creeps, creep => creep);
    }

    /**
     * Get all civilian creeps in the empire
     * @returns Array of creeps
     */
    public static GetAllCreeps_My_Civ(): Creep[] {
        return _.filter(this.GetAllCreeps_My(), (creep) => CivilianCreeps[creep.memory.role]);
    }

    /**
     * Get all creeps filtering by room name and role
     * @param roomName The room we are filtering by
     * @param roles Array of roles we are filtering by
     * @returns Array of creeps with the specified filters
     */
    public static GetCreeps_My_ByRoom_ByName_ByRoles(roomName: string, roles: RoleConstants[]): Creep[] {
        return _.filter(this.GetAllCreeps_My(), (creep) => roles.includes(creep.memory.role) && creep.memory.homeRoom === roomName);
    }
}

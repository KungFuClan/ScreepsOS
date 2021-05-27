import { RoleConstants } from "Creep/interfaces/CreepConstants";
import { StringMap } from "common/interfaces";
import _ from "lodash";

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

    /**
     * Get all my creeps filtered by role
     * @param roles Array of roles we want to filter by
     * @returns Array of filtered creeps
     */
    public static GetCreeps_My_ByRoles(roles: RoleConstants[]): Creep[] {
        return _.filter(this.GetAllCreeps_My(), (creep) => roles.includes(creep.memory.role))
    }

    /**
     * Get all creeps who have the specified target locked
     * @param target The target we're filtering for
     * @param roles The roles we want to check
     * @returns Array of creeps targeting the target
     */
    public static GetCreepsTargetingObjectByRoles(target: RoomObject, roles: RoleConstants[]): Creep[] {
        return _.filter(this.GetAllCreeps_My(), (creep) => {
            if(!creep.memory.target){
                return;
            }
            return creep.memory.target === target.id && roles.includes(creep.memory.role);
        });
    }

    /**
     * Get the creep's target from memory
     * @param creep The creep we're getting memory for
     * @returns The target object
     */
    public static GetCreepMemoryTarget<T extends RoomObject>(creep: Creep): T | null {
        if(!creep.memory.target){
            return null;
        }
        const target = Game.getObjectById(creep.memory.target);
        if(!target) return null;
        return target as T;
    }

    /**
     * Give the creep a target in memory
     * @param creep The creep we're setting the memory for
     * @param newTarget The target we are setting the memory to
     */
     public static SetCreepMemoryTarget(creep: Creep, newTarget: Id<RoomObject>): void {
        creep.memory.target = newTarget;
    }
}

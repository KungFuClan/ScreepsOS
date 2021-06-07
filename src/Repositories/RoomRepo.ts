// todo implement caching
export class RoomRepo {

    /**
     * Get all sources within a room
     * @param roomName Name of the room we want sources in
     * @returns Array of sources
     */
    public static GetAllSources_ByRoom(roomName: string): Source[] {
        const room = Game.rooms[roomName];
        if(!room){
            return [];
        }

        return room.find(FIND_SOURCES);
    }

    public static GetAllDroppedResources_ByRoom<T extends ResourceConstant>(roomName: string, resource: T): Resource<T>[] {
        const room = Game.rooms[roomName];
        if(!room) {
            return [];
        }

        const drops = room.find(FIND_DROPPED_RESOURCES);

        return drops.filter(drop => {
            return drop.resourceType === resource
        }) as Resource<T>[];
    }

    public static GetStructuresNeedingFilled_ByRoom(roomName: string): Structure[] {

        const room = Game.rooms[roomName];
        if(!room) {
            return [];
        }

        const fillableStructures: string[] = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER];

        return room.find(FIND_MY_STRUCTURES).filter(struct => fillableStructures.includes(struct.structureType)); // && (struct as AnyStoreStructure).store.getFreeCapacity<RESOURCE_ENERGY>(RESOURCE_ENERGY) > 0);

    }
}

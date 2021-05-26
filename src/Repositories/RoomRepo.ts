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
}

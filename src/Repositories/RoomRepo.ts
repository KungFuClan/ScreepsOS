// todo implement caching
export class RoomRepo {

    public static GetAllSources_ByRoom(roomName: string): Source[] {
        const room = Game.rooms[roomName];
        if(!room){
            return [];
        }

        return room.find(FIND_SOURCES);
    }
}

/* eslint-disable camelcase */

export class EmpireRepo {

    public static getRooms(): Room[] {
        return _.map(Game.rooms, room => room); // return rooms as an array instead of a hash
    }

    public static getRooms_My(): Room[] {

        if(Object.keys(Game.rooms).length <= 0) {
            return [];
        }

        const ownedRooms: Room[] = [];

        for(const room of Object.values(Game.rooms)) {

            if(room.controller && room.controller.my) {
                ownedRooms.push(room);
            }
        }

        return ownedRooms;
    }

}

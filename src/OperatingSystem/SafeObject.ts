Object.defineProperty(RoomObject.prototype, "safe", {
    get: function getSafe<T extends RoomObject>(): T {
        const object = Game.getObjectById(this.id);
        if(object === null) {
            throw new ObjectNoLongerExistsError("Object no longer exists for safe access");
        }
        return object as T;
    }
});

class ObjectNoLongerExistsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ObjectNoLongerExistsError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}



class ObjectNoLongerExistsError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = "ObjectNoLongerExistsError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

RoomObject.prototype.safe = function getSafe<T extends RoomObject>(this: T): T {
    const object = Game.getObjectById(this.id);
    if(object === null) {
        throw new ObjectNoLongerExistsError("Object no longer exists for safe access");
    }
    return object;
}

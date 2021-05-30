class BodyCostGreaterThanCapacityError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = "BodyCostGreaterThanCapacityError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class BodySizeGreaterThanLimitError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = "BodySizeGreaterThanLimitError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

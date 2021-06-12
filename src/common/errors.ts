/* eslint-disable max-classes-per-file */

import { ActionConstants } from "Creep/interfaces/CreepConstants";

export class BodyCostGreaterThanCapacityError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = "BodyCostGreaterThanCapacityError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class BodySizeGreaterThanLimitError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = "BodySizeGreaterThanLimitError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class InvalidActionTargetError extends Error {
    public constructor(expectedType: string, receivedTarget: RoomObject, action: ActionConstants) {
        super(`Invalid target received for action ${action}: ${JSON.stringify(receivedTarget)}\nExpected: ${expectedType}`);
        this.name = "InvalidActionTargetError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

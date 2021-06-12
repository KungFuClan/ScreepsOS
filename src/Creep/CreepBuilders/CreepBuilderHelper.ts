import { BodyCostGreaterThanCapacityError, BodySizeGreaterThanLimitError } from "common/errors";
import { BodyDefinition, BodyPartsUtil } from "Spawn/BodyParts";

import { SpawningOptions } from "Spawn/interfaces";

export class CreepBuilderHelper {

    public static AdjustForSpawnOptions(body: BodyDefinition, roomName: string, spawnOptions: SpawningOptions): void {
        if(spawnOptions.multiplyParts) {
            CreepBuilderHelper.AdjustForMultiplier(body, spawnOptions);
        }

        if(spawnOptions.addParts) {
            CreepBuilderHelper.AdjustForAddition(body, spawnOptions);
        }

        if(spawnOptions.offRoad) {
            CreepBuilderHelper.AdjustForOffroad(body);
        }

        CreepBuilderHelper.CheckBodySizeLimit(body, roomName);

        CreepBuilderHelper.CheckCanAffordCreep(body, roomName);

    }


    public static CheckCanAffordCreep(body: BodyDefinition, room: string): void {
        if(BodyPartsUtil.getPartsCost(body) > Game.rooms[room].energyCapacityAvailable) {
            throw new BodyCostGreaterThanCapacityError(room);
        }
    }

    public static CheckBodySizeLimit(body: BodyDefinition, room: string): void {
        if(_.sum(body, val => {return val ? val : 0}) > MAX_CREEP_SIZE) {
            throw new BodySizeGreaterThanLimitError(room)
        }
    }

    public static AdjustForOffroad(body: BodyDefinition): void {

        const totalNumParts = _.sum(body, val => { return val ? val : 0});

        const nonMovePartCount = totalNumParts - (body[MOVE] || 0);

        body[MOVE] = nonMovePartCount;

    }

    public static AdjustForMultiplier(body: BodyDefinition, spawnOptions: SpawningOptions): void {

        if(!spawnOptions.multiplyParts || Object.keys(spawnOptions.multiplyParts).length === 0) {
            return;
        }

        _.forEach(Object.keys(spawnOptions.multiplyParts), (part: BodyPartConstant) => {
            if(body[part] !== undefined) {
                body[part]! *= spawnOptions.multiplyParts![part] || 1;
            }
        });

    }

    public static AdjustForAddition(body: BodyDefinition, spawnOptions: SpawningOptions): void {

        if(!spawnOptions.addParts || Object.keys(spawnOptions.addParts).length === 0) {
            return;
        }

        _.forEach(Object.keys(spawnOptions.addParts), (part: BodyPartConstant) => {
            body[part]! += spawnOptions.addParts![part] || 0;
        });

    }
}

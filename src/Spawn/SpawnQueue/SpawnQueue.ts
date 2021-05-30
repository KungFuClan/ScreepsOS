import { BodyDefinition, BodyPartsUtil } from "Spawn/BodyParts";

import { Logger } from "utils/Logger";
import { RoleConstants } from "Creep/interfaces/CreepConstants";

export interface SpawnQueueObject {
    role: RoleConstants,
    body: BodyDefinition,
    requestingRoom: string,
    validator: undefined | ((...args: any) => boolean)
}

export interface SerializedSpawnQueueObject {
    role: RoleConstants,
    body: string,
    requestingRoom: string,
}

export class SpawnQueue { // extends Array<SpawnQueueObject>{

    public spawnQueue: SpawnQueueObject[] = []

    public get length(): number {
        return this.spawnQueue.length;
    }

    public at(index: number): SpawnQueueObject {
        return this.spawnQueue[index];
    }

    public constructor(items: SerializedSpawnQueueObject[]) {
        this.spawnQueue = SpawnQueue.deserializeMemory(items);
    }

    public push(...items: SpawnQueueObject[]): number {
        const result = this.spawnQueue.push(...items);
        this.serializeToMemory(...this.spawnQueue);
        return result;
    }

    public unshift(...items: SpawnQueueObject[]): number {
        const result = this.spawnQueue.unshift(...items);
        this.serializeToMemory(...this.spawnQueue);

        Logger.withPrefix('[unshift]').debug(`Unshifted: ${JSON.stringify(items)} \nresult: ${result}`);
        Logger.withPrefix('[unshift]').debug(`${this.spawnQueue.length} ${this.spawnQueue[0]}`);
        return result;
    }

    public pop(): SpawnQueueObject | undefined {
        const result = this.spawnQueue.pop();
        this.serializeToMemory(...this.spawnQueue);
        return result;
    }

    public shift(): SpawnQueueObject | undefined {
        const result = this.spawnQueue.shift();
        this.serializeToMemory(...this.spawnQueue);
        return result;
    }

    public *[Symbol.iterator](): IterableIterator<SpawnQueueObject> {

        for(const val of this.spawnQueue) {
            yield val;
        }

    }

    // TODO actually implement this
    public serializeToMemory(...items: SpawnQueueObject[]): void {

        const serializedQueue: SerializedSpawnQueueObject[] = new Array(items.length);

        // * Specifically using for loop to preserve array order.
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for(let i = 0; i < items.length; i++) {

            const obj = items[i];

            serializedQueue[i] = {
                body: BodyPartsUtil.serializeBody(obj.body),
                requestingRoom: obj.requestingRoom,
                role: obj.role
            };

        }

        Memory.spawnQueue = serializedQueue;
    }

    // TODO actually implement this
    public static deserializeMemory(items: SerializedSpawnQueueObject[]): SpawnQueueObject[] {
        const deserializedQueue: SpawnQueueObject[] = [];

        // * Specifically using for loop to preserve array order.
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for(let i = 0; i < items.length; i++) {

            const obj = items[i];

            deserializedQueue[i] = {
                body: BodyPartsUtil.deserializeBody(obj.body),
                requestingRoom: obj.requestingRoom,
                role: obj.role,
                validator: undefined
            }
        }

        return deserializedQueue;
    }
}

export const spawnQueue = new SpawnQueue(Memory.spawnQueue);

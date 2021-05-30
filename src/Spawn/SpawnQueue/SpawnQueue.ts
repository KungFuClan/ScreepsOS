import { BodyDefinition, BodyPartsUtil } from "Spawn/BodyParts";

import { Logger } from "utils/Logger";
import { RoleConstants } from "Creep/interfaces/CreepConstants";

export interface SpawnQueueObject {
    role: RoleConstants,
    body: BodyPartConstant[],
    requestingRoom: string,
    memory: CreepMemory,
    validator: undefined | ((...args: any) => boolean)
}

export interface SerializedSpawnQueueObject {
    role: RoleConstants,
    body: BodyPartConstant[],
    requestingRoom: string,
    memory: CreepMemory
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

    public delete(obj: SpawnQueueObject): void {

        const indexOf = this.spawnQueue.findIndex(value => JSON.stringify(obj) === JSON.stringify(value));

        if(indexOf > -1) {
            this.spawnQueue.splice(indexOf, 1);
        }

    }

    public *[Symbol.iterator](): IterableIterator<SpawnQueueObject> {
        for(const val of this.spawnQueue) {
            yield val;
        }
    }

    public serializeToMemory(...items: SpawnQueueObject[]): void {

        const serializedQueue: SerializedSpawnQueueObject[] = new Array(items.length);

        // * Specifically using for loop to preserve array order.
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for(let i = 0; i < items.length; i++) {

            const obj = items[i];

            serializedQueue[i] = {
                body: obj.body,
                requestingRoom: obj.requestingRoom,
                role: obj.role,
                memory: obj.memory
            };

        }

        Memory.spawnQueue = serializedQueue;
    }

    public static deserializeMemory(items: SerializedSpawnQueueObject[]): SpawnQueueObject[] {
        const deserializedQueue: SpawnQueueObject[] = [];

        if(items === undefined || items.length === 0) {
            return [];
        }
        // * Specifically using for loop to preserve array order.
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for(let i = 0; i < items.length; i++) {

            const obj = items[i];

            deserializedQueue[i] = {
                body: obj.body,
                requestingRoom: obj.requestingRoom,
                role: obj.role,
                memory: obj.memory,
                validator: undefined
            }
        }

        return deserializedQueue;
    }
}

export const spawnQueue = new SpawnQueue(Memory.spawnQueue);

/* eslint-disable @typescript-eslint/no-namespace */
import { genTest123 } from "generatorTest";
import { kernel } from "OperatingSystem/kernel";
import { runSpawns } from "Spawn/exampleSpawn";
import { ErrorMapper } from "utils/ErrorMapper";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    role: string;
    room: string;
    working: boolean;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  //* Check if the process exists yet, if not start it
  // ! Do not start a process every tick, as it will override the existing one each tick - no iteration
  if(!kernel.hasProcess("genTest")) {
      kernel.createProcess("genTest", genTest123, []);
  }

  //* Normally this would just restart same thread - renamed thread for clarity of demonstration
  // ! Don't start thread every tick, or it will overwrite the existing named one each tick - no iteration
  if(!kernel.hasThread("genTest:main") && !kernel.hasThread("genTest:restarted")) {
    kernel.createThread("genTest", "restarted", genTest123, []);
  }

  // runSpawns.createProcess();

  //* Just call this once per tick, iterates through the entire queue based on this. Can also create multiple queues and multiple runs if needed.
  kernel.tick();

  // const newGen = genTest123();
  // console.log(newGen.next().value);
  // console.log(newGen.next().value);
  // console.log(newGen.next().value);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  if(Game.shard.name !== "sim"){
    // Game.cpu.generatePixel();
  }
});

import { BodyArrayModifier } from "Spawn/BodyParts";

export class CommonCreepHelper {

    public static PartCount(creep: Creep, partToCount: BodyPartConstant): number {

        let partCount = 0;

        for(const part of creep.body) {
            if(part.type === partToCount) {
                partCount++
            }
        }

        return partCount;

    }


}

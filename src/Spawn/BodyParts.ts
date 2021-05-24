import {} from 'constants';

export type BodyDefinition = {
    [index: string]: number | undefined,
    [WORK]?: number,
    [MOVE]?: number,
    [CARRY]?: number,
    [CLAIM]?: number
    [ATTACK]?: number,
    [RANGED_ATTACK]?: number,
    [HEAL]?: number,
    [TOUGH]?: number,
}

export class BodyPartsUtil {

    public static getPartsCost(body: BodyDefinition): number {

        let sum = 0;

        for(const part in body) {

            sum += BODYPART_COST[part as BodyPartConstant] * body[part]!;

        }

        return sum;
    }

    public static getSerializedPartsCost(bodyString: string): number {

        const bodyDefinition = this.deserializeBody(bodyString);

        return this.getPartsCost(bodyDefinition);

    }

    public static serializeBody(body: BodyDefinition): string {

        let bodyString = "";

        for(const part in body) {
            if(part === CLAIM) {
                bodyString = bodyString + `x${body[part]!}`;
            }
            bodyString = bodyString + `${part.substr(0, 1)}${body[part]!}`;
        }

        return bodyString;
    }

    public static deserializeBody(bodyString: string): BodyDefinition {

        const body: BodyDefinition = {
            [MOVE]: 0,
            [WORK]: 0,
            [CARRY]: 0,
            [CLAIM]: 0,
            [ATTACK]: 0,
            [HEAL]: 0,
            [RANGED_ATTACK]: 0,
            [TOUGH]: 0,
        };

        for(let i = 0; i < bodyString.length; i += 2) {

            const char = bodyString[i];

            switch(char) {
                case 'm':
                    body[MOVE]! += parseInt(bodyString[i+1], 10);
                    break;
                case 'w':
                    body[WORK]! += parseInt(bodyString[i+1], 10);
                    break;
                case 'c':
                    body[CARRY]! += parseInt(bodyString[i+1], 10);
                    break;
                case 'x':
                    body[CLAIM]! += parseInt(bodyString[i+1], 10);
                    break;
                case 'a':
                    body[ATTACK]! += parseInt(bodyString[i+1], 10);
                    break;
                case 'h':
                    body[HEAL]! += parseInt(bodyString[i+1], 10);
                    break;
                case 'r':
                    body[RANGED_ATTACK]! += parseInt(bodyString[i+1], 10);
                    break;
                case 't':
                    body[TOUGH]! += parseInt(bodyString[i+1], 10);
                    break;
                default:
                    throw new Error(`Invalid body string passed to deserialize body. Invalid char: ${char}.`);
            }

        }

        return body;

    }
}

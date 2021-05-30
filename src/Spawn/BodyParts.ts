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

export enum BodyArrayStyle {
    GROUPED = 0,
    COLLATED = 1
}

export enum BodyArrayModifier {
    TOUGH_FIRST = 0,
    HEAL_LAST = 1
}

export class BodyPartsUtil {

    public static getPartsArray(body: BodyDefinition, bodyStyle: BodyArrayStyle, bodyModifiers: BodyArrayModifier[]): BodyPartConstant[] {

        const toughFirst = !!bodyModifiers.find(val => val === BodyArrayModifier.TOUGH_FIRST);
        const healLast = !!bodyModifiers.find(val => val === BodyArrayModifier.HEAL_LAST);
        let healPartsHeld = 0;

        const parts: BodyPartConstant[] = [];

        if(toughFirst) {
            parts.push(...this.createPartArray(TOUGH, body[TOUGH] || 0));
            body[TOUGH] = 0;
        }

        if(healLast) {
            healPartsHeld = body[HEAL] || 0;
            body[HEAL] = 0;
        }

        if(bodyStyle === BodyArrayStyle.GROUPED) {
            parts.push(...this.groupParts(body));
        }

        if(bodyStyle === BodyArrayStyle.COLLATED) {
            parts.push(...this.collateParts(body));
        }

        if(healLast) {
            parts.push(...this.createPartArray(HEAL, healPartsHeld));
        }

        return parts;

    }

    private static createPartArray(part: BodyPartConstant, count: number): BodyPartConstant[] {

        const returnArray: BodyPartConstant[] = [];

        for(let i = 0; i < count; i++) {
            returnArray.push(part);
        }

        return returnArray;
    }

    private static groupParts(bodyDefinition: BodyDefinition): BodyPartConstant[] {

        const returnParts: BodyPartConstant[] = [];
        _.forEach(Object.keys(bodyDefinition), (part: BodyPartConstant) => {
            returnParts.push(...this.createPartArray(part, bodyDefinition[part] || 0));
        });
        return returnParts;
    }

    private static collateParts(bodyDefinition: BodyDefinition):BodyPartConstant[] {

        const returnParts: BodyPartConstant[] = [];
        const numParts: number = _.sum(_.values(bodyDefinition));
        const partNames = Object.keys(bodyDefinition) as BodyPartConstant[];

        let i = 0;
        while (i < numParts) {
            for(const currPart of partNames) {
                if (bodyDefinition[currPart]! > 0) {
                    returnParts.push(currPart);
                    bodyDefinition[currPart]!--;
                    i++;
                }
            }
        }
        return returnParts;

    }

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

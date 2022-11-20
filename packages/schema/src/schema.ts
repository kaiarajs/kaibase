import { Schema as ISchema } from "./types";
import { NumberType } from "./types/number";
import { ObjectType } from "./types/object";

export const Schema: ISchema = {
    number() {
        return new NumberType();
    },
    validate(schema: any, value: any) {
        return new ObjectType().keys(schema).validate(value)
    },
    extend(name, type) {
        return Object.assign(Schema, { [name]: type }) as never;
    },
    
};
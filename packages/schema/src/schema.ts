import { Schema as ISchema } from "./types";
import { ArrayType } from "./types/array";
import { BooleanType } from "./types/boolean";
import DateType from "./types/date";
import { IdType } from "./types/id";
import { NumberType } from "./types/number";
import { ObjectType } from "./types/object";
import { StringType } from "./types/string";

export const Schema: ISchema = {
    number() {
        return new NumberType();
    },
    string() {
        return new StringType();
    },
    id() {
        return new IdType();
    },
    object() {
        return new ObjectType();
    },
    array() {
        return new ArrayType();
    },
    boolean() {
        return new BooleanType();
    },
    date() {
        return new DateType();
    },
    validate(schema: any, value: any) {
        return new ObjectType().keys(schema).validate(value)
    },
    extend(name, type) {
        return Object.assign(Schema, { [name]: type }) as never;
    },
    
};
import { BaseType } from "./types/base-type";
import { NumberType } from "./types/number";
import { StringType } from "./types/string";

export type Validator<Type> = (value: Type) => Type;

export type DefaultType<Type> = () => Type | any;

export interface MessageTemplate {
    [name: string]: (params: any) => string;
}


export type Value<T> = T extends Record<string, unknown>
  ? { [Key in keyof T]-?: Value<T[Key]> }
  : T extends (infer U)[]
  ? Value<U>[]
  : T extends undefined
  ? null
  : T;
  
export type WithRequired<
  SchemaT extends BaseType<any, any>,
  Required extends boolean
> = SchemaT & { isRequired: Required extends false ? any : true };


export type DefaultValue<
  SchemaT extends BaseType<any, any>
> = SchemaT["getDefault"] extends () => infer ReturnT ? ReturnT : never;

export type Result<
  Type,
  InputT,
  SchemaT extends BaseType<Type, any>,
  Value
> = SchemaT["isRequired"] extends true
  ? ResultRequired<Type, InputT, ParsedValue<Value, DefaultValue<SchemaT>>>
  : ResultOptional<Type, InputT, ParsedValue<Value, DefaultValue<SchemaT>>>;


  export type ParsedValue<Value, Default> = Value extends null | undefined
  ? Default
  : Value;
export type WithDefault<
    SchemaT extends BaseType<any, any>,
    Default
> = SchemaT & { getDefault: () => Default };

export type SchemaReturn<
    Fn extends () => BaseType<any, any>
> = Fn extends () => infer Type ? Type : never;

export type ResultRequired<Type, InputT, Value> = Value extends InputT
  ? Type
  : never;

export type ResultOptional<Type, InputT, Value> = Value extends InputT
  ? Type
  : Value extends null | undefined
  ? null
  : never

export type Messages<MT extends MessageTemplate> = {
    [Key in keyof MT]: string;
} & {
    required: string;
};

export type MessageArgs<
    T extends (params: Record<string, unknown>) => string
> = T extends (params: infer U) => string ? U : never;

export type SchemaType<SchemaT extends BaseType<any, any>> = WithDefault<
  SchemaT,
  null
>;

export interface Schema {

    number(): SchemaType<NumberType>;

    string(): SchemaType<StringType>;

    validate(schema: any, value: any):  { [x: string]: unknown; } | null;

    extend<Name extends string, Type extends () => BaseType<Type>>(
        name: Name,
        type: Type,
    ): this & { [Key in Name]: () => SchemaType<SchemaReturn<Type>> };
}

export type ErrorDetails<T> = T extends Array<infer U>
    ? string | { [index: number]: ErrorDetails<U> }
    : T extends Record<string, unknown>
    ? string | { [K in keyof T]?: ErrorDetails<T[K]> }
    : string;

export default class SchemaError<T> extends Error {
    constructor(public details: ErrorDetails<T>) {
        super("Schema validation failed.");
    }
}
import { BaseType, KeysResult, KeysType } from "./base-type";
import SchemaError, { ErrorDetails, MessageTemplate, Value } from "../types";
import { Console } from "console";

export interface Template extends MessageTemplate {

    max(params: { max: number }): string;

    min(params: { min: number }): string;
}

export type JsonType = Record<string, unknown>;
export class ObjectType<
Type extends JsonType,
I = Type
> extends BaseType<Type, MessageTemplate> {

    public max(max: number): this {
        return this.pipe((value) => {
          if (Object.keys(value).length <= max) return value;
    
          this.fail<string>(this.render("max", { max }));
        });
      }
    
      public min(min: number): this {
        return this.pipe((value) => {
          if (Object.keys(value).length >= min) return value;
    
          this.fail<string>(this.render("min", { min }));
        });
      }

      protected initialValidator(value: unknown): Type {
        if (value instanceof Object) return value as Type;
    
        this.fail<string>(this.render("object"));
      }

      public keys<K extends KeysType<Value<JsonType>>>(type: K): KeysResult<Value<JsonType>, K> {
        return this.pipe((value) => {
          const errors: Record<string, unknown> = {};
    
          const result = Object.keys(type).reduce<Record<string, unknown>>(
            (prev, key) => {
              let ret = value[key];
              try {
                ret = type[key].label(key).validate(ret);
              } catch (error) {
                if (error instanceof SchemaError) {
                  errors[key] = error.details;
                } else throw error;
              }
    
              if (ret != null) prev[key] = ret;
    
              return prev;
            },
            {},
          );
    
          if (Object.keys(errors).length > 0) this.fail(errors as ErrorDetails<Type>);
          return result as Type;
        }) as never;
      }
}
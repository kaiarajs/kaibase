import { BaseType } from "./base-type";
import SchemaError, { ErrorDetails, Messages, MessageTemplate } from "../types";

export interface Template extends MessageTemplate {
    array(): string;
  
    length(params: { length: number }): string;
  
    max(params: { max: number }): string;
  
    min(params: { min: number }): string;
  }
  
  export type ItemsType<T> = T extends unknown
    ? unknown extends T
      ? 
      BaseType<any>
      : BaseType<T>
    : BaseType<T>;
  
  export type ItemsResult<T, A extends BaseType<any>> = T extends unknown
    ? unknown extends T
      ? A extends BaseType<infer U>
        ? BaseType<U>
        : BaseType<T>
      : BaseType<T>
    : BaseType<T>;


export class ArrayType<T = unknown> extends BaseType<T[],MessageTemplate> {
  
    public get messages(): Messages<Template> {
    return {
      required: "Expected {{ label }} to have a value",
      array: "Expected {{ label }} to be an array",
      length: "Expected {{ label }} to contain exactly {{ length }} item(s)",
      max: "Expected {{ label }} to contain at most {{ max }} item(s)",
      min: "Expected {{ label }} to contain at least {{ min }} item(s)",
    };
  }

  public length(length: number): this {
    return this.pipe((value) => {
      if (value.length === length) return value;

      this.fail(this.render("length", { length }));
    });
  }

  public max(max: number): this {
    return this.pipe((value) => {
      if (value.length <= max) return value;

      this.fail(this.render("max", { max }));
    });
  }

  public min(min: number): this {
    return this.pipe((value) => {
      if (value.length >= min) return value;

      this.fail(this.render("min", { min }));
    });
  }

  public items<A extends ItemsType<T>>(type: A): ItemsResult<T, A> {
    return this.pipe((value) => {
      const label = this._label;
      const errors: ErrorDetails<T[]> = {};

      const result = value.reduce<T[]>((prev, cur, index) => {
        let ret = cur;

        if (label != null) type.label(`${label}[${index}]`);

        try {
          ret = (type as BaseType<T>).validate(cur) as T;
        } catch (error) {
          if (error instanceof SchemaError) {
            errors[index] = error.details as ErrorDetails<T>;
          } else throw error;
        }

        return prev.concat(ret);
      }, []);

      if (Object.keys(errors).length > 0) this.fail(errors);

      return result;
    }) as never;
  }

  protected initialValidator(value: unknown): T[] {
    if (Array.isArray(value)) return value;

    this.fail(this.render("array"));
  }
}


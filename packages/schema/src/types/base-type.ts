import SchemaError, { DefaultType, DefaultValue, ErrorDetails, MessageArgs, Messages, MessageTemplate, Result, Validator, Value, WithDefault, WithRequired } from "../types";
import { ObjectType } from "./object";

export type KeyValue<V> = null extends V
  ? BaseType<NonNullable<V>>
  : WithDefault<BaseType<V>, V> | WithRequired<BaseType<V>, true>;

export type Keys<T extends Record<string, unknown>> = {
  [K in keyof T]: KeyValue<T[K]>;
};

export type KeysType<T extends Record<string, unknown>> = T extends Record<
  string,
  unknown
>
  ? Record<string, unknown> extends T
    ?
      Keys<any>
    : Keys<T>
  : Keys<T>;

export type KeysResult<
  T extends Record<string, unknown>,
  K extends Keys<T>
> = T extends Record<string, unknown>
  ? Record<string, unknown> extends T
    ? K extends Keys<infer U>
      ? ObjectType<U, Input<U, K>>
      : ObjectType<T>
    : ObjectType<T>
  : ObjectType<T>;

type Input<
  Value extends Record<string, unknown>,
  Schema extends Keys<Value>
> = Partial<InputNullable<Value, Schema>> &
  Pick<
    InputNullable<Value, Schema>,
    {
      [Key in keyof Value]: DefaultValue<Schema[Key]> extends null
        ? Schema[Key]["isRequired"] extends true
          ? Key
          : never
        : never;
    }[keyof Value]
  >;

type InputNullable<
  Value extends Record<string, unknown>,
  Schema extends Keys<Value>
> = {
  [Key in keyof Value]: DefaultValue<Schema[Key]> extends null
    ? Schema[Key]["isRequired"] extends true
      ? Value[Key]
      : Value[Key] | null | undefined
    : Value[Key] | null | undefined;
};


export abstract class BaseType<Type,Message extends MessageTemplate = MessageTemplate>{

    protected _pipeline: Validator<Type>[] = [];

    protected _label?: string;

    public getDefault: DefaultType<Type> = () => null;

    public isRequired = false;

    public get messages(): Messages<Message> {
        return {
            required: "Expected {{ label }} to have a value",
        } as Messages<Message>;
    }

    constructor() {
        this.pipe(this.initialValidator);
    }

    public label(label: string): this {
        this._label = label;

        return this;
    }

    public pipe(...validators: Validator<Type>[]): this {
        this._pipeline = this._pipeline.concat(validators);

        return this;
    }

      public required<R extends boolean = true>(
    required: R = true as R,
  ): WithRequired<this, R> {
    this.isRequired = required;

    return this as WithRequired<this, R>;
  }



    public validate<V = DefaultValue<this>>(
        value: V = this.getDefault() as never,
      ): Result<Type, Message, this, V> {
        if (value == null) {
          if (this.isRequired) this.fail<string>(this.render("required"));
    
          return null as Result<Type, Message, this, V>;
        }
        return this._pipeline.reduce(
          (result: Type, validator) => validator.call(this, result),
          value as never,
        ) as Result<Type, Message, this, V>;
      }

    protected render(
        message: string,
        params: any = {} as any,
    ): string {
        const label = this._label;
        const template = this.messages[message].replace(
            /{{ *label *}} ?/g,
            label == null ? "" : `${label} `,
        );

        return Object.keys(params).reduce(
            (prev, key) =>
                prev.replace(new RegExp(`{{ *${key} *}}`, "g"), params[key] as string),
            template,
        );
    }

    protected fail<D = Type>(details: ErrorDetails<D>): never {
        throw new SchemaError<D>(details);
    }

    protected abstract initialValidator(value: unknown): Type;
}
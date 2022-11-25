import { BaseType } from "./base-type";
import { Messages, MessageTemplate } from "../types";

export interface Template extends MessageTemplate {
    boolean(): string;
  }

export class BooleanType extends BaseType<boolean, MessageTemplate> {
  public get messages(): Messages<Template> {
    return {
        required: "Expected {{ label }} to have a value",
      boolean: "Expected {{ label }} to be a boolean",
    };
  }

  protected initialValidator(value: unknown): boolean {
    if (typeof value === "boolean") return value;

    this.fail(this.render("boolean"));
  }
}
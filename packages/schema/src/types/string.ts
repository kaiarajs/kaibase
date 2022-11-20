import { BaseType } from "./base-type";
import { Messages, MessageTemplate } from "../types";

export interface Template extends MessageTemplate {
    string(): string;    
    max(params: { max: number }): string;
    min(params: { min: number }): string;
}


export class NumberType extends BaseType<string, MessageTemplate> {

    public get messages(): Messages<MessageTemplate> {
        return {
            required: "Expected {{ label }} to have a value",
            string: "Expected {{ label }} to be a valid string",
            max: "Expected {{ label }} to contain at most {{ max }} character(s)",
            min: "Expected {{ label }} to contain at least {{ min }} character(s)",
        };
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
    protected initialValidator(value: unknown): string {
        if (typeof value === "string") return value;

        this.fail(this.render("string"));
    }
}
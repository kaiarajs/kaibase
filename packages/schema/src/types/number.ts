import { BaseType } from "./base-type";
import { Messages, MessageTemplate } from "../types";

export interface Template extends MessageTemplate {

    max(params: { max: number }): string;

    min(params: { min: number }): string;
}


export class NumberType extends BaseType<number, MessageTemplate> {

    public get messages(): Messages<MessageTemplate> {
        return {
            //@ts-ignore
            required: super.messages.required,
            max: "Expected {{ label }} to be less than {{ max }}",
            number: "Expected {{ label }} to be a valid number"
        };
    }

    public max(max: number): this {
        return this.pipe((value) => {
            if (value <= max) return value;

            this.fail(this.render("max", { max }));
        });
    }

    public min(min: number): this {
        return this.pipe((value) => {
            if (value >= min) return value;

            this.fail(this.render("min", { min }));
        });
    }

    protected initialValidator(value: unknown): number {
        if (typeof value === "number") return value;

        this.fail(this.render("number"));
    }
}
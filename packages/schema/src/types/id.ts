import { BaseType } from "./base-type";
import { Messages, MessageTemplate } from "../types";

export interface Template extends MessageTemplate {
    id(): string;
    ref(params: { model: string }): string;
}


export class IdType extends BaseType<string, MessageTemplate> {

    public get messages(): Messages<MessageTemplate> {
        return {
            required: "Expected {{ label }} to have a value"
        };
    }

    public ref(ref: string): this {
        return this.pipe((value) => {
            if (typeof ref === "string") return value;

            this.fail(this.render("ref", { ref }));
        });
    }


    protected initialValidator(value: unknown): string {
        if (typeof value === "string") return value;

        this.fail(this.render("string"));
    }
}
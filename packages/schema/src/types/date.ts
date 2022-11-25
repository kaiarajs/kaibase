import { BaseType } from "./base-type";
import { Messages, MessageTemplate } from "../types";

export interface Template extends MessageTemplate {
    date(): string;

    max(params: { date: Date }): string;

    min(params: { date: Date }): string;
}

export type DateInputType = Date | string | number;

export default class DateType extends BaseType<Date, Template> {
    public get messages(): Messages<Template> {
        return {
            required: "Expected {{ label }} to have a value",
            date: "Expected {{ label }} to be a valid date",
            max: "Expected {{ label }} to be before or same as {{ date }}",
            min: "Expected {{ label }} to be after or same as {{ date }}",
        };
    }

    public max(max: DateInputType | (() => DateInputType)): this {
        const getMax = getDate(max);

        return this.pipe((value) => {
            const date = getMax();

            if (value <= date) return value;

            this.fail(this.render("max", { date }));
        });
    }

    public min(min: DateInputType | (() => DateInputType)): this {
        const getMin = getDate(min);

        return this.pipe((value) => {
            const date = getMin();

            if (value >= date) return value;

            this.fail(this.render("min", { date }));
        });
    }

    protected initialValidator(value: unknown): Date {
        if (typeof value === "string" || typeof value === "number")
            value = new Date(value);

        if (value instanceof Date && value.toString() !== "Invalid Date")
            return value;

        this.fail(this.render("date"));
    }
}

function getDate(value: DateInputType | (() => DateInputType)): () => Date {
    if (typeof value === "string" || typeof value === "number") {
        const date = new Date(value);

        return () => date;
    }

    if (typeof value === "function") {
        return () => {
            const date = value();

            if (typeof date === "string" || typeof date === "number")
                return new Date(date);

            return date;
        };
    }

    return () => value;
}
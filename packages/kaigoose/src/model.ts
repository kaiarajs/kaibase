import { Schema } from "@kaiarajs/schema";
import { Kaigoose } from "./kaigoose";



export class Model  {
    name;
    schema;
    constructor(name: string, schema: Object) {
        this.name = name;
        this.schema = schema;
    }

    validate(value: Record<string, unknown>) {
        return Schema.validate(this.schema, value);
    }

    async create(value: Record<string, unknown>) {
       this.validate(value);
       return await Kaigoose.kaibase.collection(this.name).insert(value)
    }
}
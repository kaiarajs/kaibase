import { UpdateOptions } from "@kaiarajs/kaibase/dist/types";
import { Schema } from "@kaiarajs/schema";
import { Kaigoose } from "./kaigoose";
import { KCursor } from "./kcursor";



export class Model  {
    name: string;
    schema: Object;

    constructor(name: string, schema: Object) {
        this.name = name;
        this.schema = schema;
    }

    validate(value: Record<string, unknown>) {
        return Schema.validate(this.schema, value);
    }

    setCollectionName(name: string) {
        this.name = name;
        return this;
    }

    async create(value: Record<string, unknown>) {
       this.validate(value);
       return await Kaigoose.kaibase.collection(this.name).insert(value)
    }

    find(query?: any) {
        return new KCursor(this.name, this.schema, query)
    }

    async findById(id: string) {
        return await Kaigoose.kaibase.collection(this.name).find({_id: id}).exec();
    }

    async deleteById(id: string) {
        return await Kaigoose.kaibase.collection(this.name).remove({_id: id});
    }

    async update(query: Record<string, unknown>, updateContent: any, updateOptions?: UpdateOptions) {
        return await Kaigoose.kaibase.collection(this.name).update(query, updateContent, updateOptions)
    } 
}
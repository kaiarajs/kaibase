import { UpdateOptions } from "@kaiarajs/kaibase/dist/types";
import { Schema } from "@kaiarajs/schema";
import { Kaigoose } from "./kaigoose";



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

    async create(value: Record<string, unknown>) {
       this.validate(value);
       return await Kaigoose.kaibase.collection(this.name).insert(value)
    }

    async find(query?: any, sort?: Record<string, unknown>, skip?: number, limit?: number) {
        return await Kaigoose.kaibase.collection(this.name).find(query).sort(sort).skip(skip || 0).limit(limit || 100).exec();
    }

    async findById(id: string) {
        return await Kaigoose.kaibase.collection(this.name).find({id}).exec();
    }

    async deleteById(id: string) {
        return await Kaigoose.kaibase.collection(this.name).remove({id});
    }


    async update(query: Record<string, unknown>, updateContent: any, updateOptions?: UpdateOptions) {
        return await Kaigoose.kaibase.collection(this.name).update(query, updateContent, updateOptions)
    } 
}
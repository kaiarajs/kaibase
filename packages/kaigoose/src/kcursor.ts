import { Kaigoose } from "./kaigoose";

export interface IKCursor {
    sort(sort: any): this;
    skip(skip: number): this;
    limit(limit: number): this;
    populate(fieldName: string): this;
    exec(): Promise<any[] | number>;
}

export interface IKOptions {
    populate: string[];
    sort?: any;
    skip?: number;
    limit?: number;
}

export class KCursor implements IKCursor {

    collectionName: string;
    query: string;
    schema: Object;

    private options: IKOptions;

    constructor(collectionName: string, schema: Object, query: any) {
        this.options = {
            populate: [],
            sort: undefined,
            skip: 0,
            limit: undefined
        }
        this.collectionName = collectionName;
        this.schema = schema;
        this.query = query;
    }

    /**
    * Sort order for fields
    * @param sort - sort object `{fieldName: 1 | -1}`
    */
    public sort(sort: any): this {
        this.options.sort = sort;
        return this;
    }

    /**
     * Set how many results to skip
     * @param skip - how many results to skip
     */
    public skip(skip: number): this {
        this.options.skip = skip;

        return this;
    }

    /**
     * Limit result size
     * @param limit - how many results
     */
    public limit(limit: number): this {
        this.options.limit = limit;
        return this;
    }

    public populate(fieldName: string) {
        this.options.populate?.push(fieldName)
        return this
    }

    public async exec() {
        const results = await Kaigoose.kaibase.collection(this.collectionName).find(this.query).sort(this.options.sort).skip(this.options.skip || 0).limit(this.options.limit || 10000).exec() as any[]
        for await (const poupu of this.options.populate) {
            for await (const item of results) {
                let isArray = true;
                
                if(typeof item[poupu] === 'string') {
                    isArray = false;
                }
                
                if (!isArray) {
                    const itemToPopu = await Kaigoose.kaibase.collection(this.schema[poupu].idRef).find({ _id: item[poupu] }).exec() as any[]
                    if (itemToPopu && itemToPopu.length === 1) {
                        item[poupu] = itemToPopu[0]
                    }
                } else {
                    let values: any[] = []
                    for await (const itemInArrayIds of item[poupu]) {
                        const itemToPopu = await Kaigoose.kaibase.collection(this.schema[poupu].idRef).find({ _id: itemInArrayIds }).exec() as any[]
                        if(itemToPopu && itemToPopu.length === 1) {
                            values.push(itemToPopu[0])
                        }
                    }
                    item[poupu] = values
                }

            }
        }
        return results;
    }


}
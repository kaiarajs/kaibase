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

    private options: IKOptions;

    constructor(collectionName:string, query: any) {
        this.options = {
            populate: [],
            sort: undefined,
            skip: 0,
            limit: undefined 
        }
        this.collectionName = collectionName;
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

    public async exec() {
        const results =  await Kaigoose.kaibase.collection(this.collectionName).find(this.query).sort(this.options.sort).skip(this.options.skip || 0).limit(this.options.limit || 10000).exec() as any[]
        for await (const poupu of this.options.populate) {
            console.log('popu', poupu)
            for await (const item of this.options.populate) {
                console.log('item', item)
               // const itemToPopu = await Kaigoose.kaibase.collection(this.collectionName).find()
            }
        }
        return results;
    }


}
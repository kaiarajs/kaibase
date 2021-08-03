import { AxiosInstance } from "axios";
import { Filter, Document, DbResponse, Sort } from "./types";

export class Db {

    _collection: string | null = null;
    _axios: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this._axios = axiosInstance;
    }

    collection(name: string) {
        this._collection = name;
        return this;
    }

    async get(filter?: Filter<Document>, sort?: Sort, limit?: number): Promise<DbResponse> {
        const req = await this._axios.get('/db',{ headers: { collection: this._collection}, params: { filter, sort, limit } });
        if(req.status === 200) {
            return {
                success: true,
                data: req.data
            }
        } else {
            return {
                success: false,
                data: req.data || null
            }
        }
    }

    async update(filter: Filter<Document>, doc: Document): Promise<DbResponse> {
        const req = await this._axios.put('/db', doc, { headers: { collection: this._collection}, params: filter});
        if(req.status === 200) {
            return {
                success: true,
                data: req.data
            }
        } else {
            return {
                success: false,
                data: req.data || null
            }
        }
    }

    async add(doc: Document): Promise<DbResponse> {
        const req = await this._axios.post('/db', doc, { headers: { collection: this._collection}});
        if(req.status === 201) {
            return {
                success: true,
                data: req.data
            }
        } else {
            return {
                success: false,
                data: req.data || null
            }
        }
    }

    async delete(filter?: Filter<Document>): Promise<{success: boolean}>  {
        const req = await  this._axios.delete('/db',{ headers: { collection: this._collection}, params: filter})
        if(req.status === 201) {
            return {
                success: true,
            }
        } else {
            return {
                success: false,
            }
        }
    }
}
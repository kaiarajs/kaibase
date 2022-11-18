import { Exist, Sanitize, StorageDriver } from "@kaiarajs/kaibase"
import fetch, { HeadersInit } from 'node-fetch-commonjs';
import qs from 'querystring';

export class ApiStorageDriver implements StorageDriver {
    public allKeys: string[];
    public apiUrl: string;
    public collection: string = 'data';
    public fileExtension: string = 'json';

    private requestOptions: {method: string, headers: HeadersInit, body?: string} = { method: 'POST', headers: { 'Content-Type': 'application/json' } };

    constructor(config?: { apiUrl?: string, fileExtension?: string }) {

        if (config?.apiUrl) {
            const url = config?.apiUrl.split('?')[0]
            const params = qs.parse(config?.apiUrl.split('?')[1])
            if(params['api-key']) {
                this.requestOptions.headers = {...this.requestOptions.headers, 'api-key': params['api-key'] as string}
            }
            this.apiUrl = url;
        } else {
            this.apiUrl = `http://localhost:3000`
        }

        if (config?.fileExtension) {
            this.fileExtension = config.fileExtension;
        }

        
        this.allKeys = [];

    }
    dump(collections: string[]): Promise<any> {
        throw new Error("Method not implemented.");
    }


    setCollection(name: string): void {
        this.collection = name;
    }
    getCollections(): string[] {
        throw new Error("Method not implemented.");
    }
    removeItem(key: string): Promise<null> {
        throw new Error("Method not implemented.");
    }
    storeIndex(key: string, index: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    fetchIndex(key: string): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    removeIndex(key: string): Promise<null> {
        throw new Error("Method not implemented.");
    }
    keys(): Promise<string[]> {
        throw new Error("Method not implemented.");
    }
    exists(obj: Sanitize, index: any, fieldName: string): Promise<Exist> {
        throw new Error("Method not implemented.");
    }
    collectionSanitize(keys: string[]): Promise<null> {
        throw new Error("Method not implemented.");
    }
    clear(): Promise<null> {
        throw new Error("Method not implemented.");
    }



    /**
    * using the cwd use the filepath to write to the file
    * given the key send the data
    * else reject a new error message.
    */
    public async setItem(key: string, value: any): Promise<any> {
        const response = await fetch(`${this.apiUrl}/${this.collection}/setItem`, {...this.requestOptions, body: JSON.stringify({ key, value })});
        const data: any = await response.json();
        if(response.ok) {
            return data;
        } else {
            throw new Error(data.message);
        }
    }

    /**
    * using the cwd use the file path to read the file contents
    * parse the file and return the item with the given key
    * else reject a new error message.
    */
    public async getItem(key: string): Promise<any> {
        const response = await fetch(`${this.apiUrl}/${this.collection}/getItem`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) });
        const data: any = await response.json();
        if(response.ok) {
            return data;
        } else {
            throw new Error(data.message);
        }
    }

    /**
    * using the cwd use the file path to read the file contents
    * parse the file and return the item with the given key
    * else reject a new error message.
    */
    public async iterate(iteratorCallback: (key: string, value: any, iteratorNumber?: number | undefined) => any): Promise<any> {
        const response = await fetch(`${this.apiUrl}/${this.collection}/iterate`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
        const data: any = await response.json();
        if (response.ok) {
            return data.forEach(element => {
                return iteratorCallback(element.k, element.v)
            });

        } else {
            throw new Error(data.message);

        }
    }
}
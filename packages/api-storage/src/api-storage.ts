import { Exist, Sanitize, StorageDriver } from "@hakibase/hakibase"
import fetch from 'node-fetch-commonjs';

export class ApiStorageDriver implements StorageDriver {
    public allKeys: string[];
    public apiUrl: string;
    public collection: string = 'data';
    public fileExtension: string = 'json';

    constructor(config?: { apiUrl?: string, fileExtension?: string }) {
        
        if (config?.apiUrl) {
            this.apiUrl = config.apiUrl;
        } else {
            this.apiUrl = `http://localhost:3000`
        }

        if (config?.fileExtension) {
            this.fileExtension = config.fileExtension;
        }
        this.allKeys = [];
     
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
    iterate(iteratorCallback: (key: string, value: any, iteratorNumber?: number | undefined) => any): Promise<any> {
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
        console.log({key,value})
        console.log(JSON.stringify({key,value}) )
        const response = await fetch(`${this.apiUrl}/${this.collection}/setItem`, { method: 'POST',  headers: {'Content-Type': 'application/json'}, body: JSON.stringify({key,value}) });
        const data = await response.json();
        return data;
    }

     /**
     * using the cwd use the file path to read the file contents
     * parse the file and return the item with the given key
     * else reject a new error message.
     */
      public async getItem(key: string): Promise<any> {
        const response = await fetch(`${this.apiUrl}/${this.collection}/getItem`, { method: 'POST', headers: {'Content-Type': 'application/json'},body: JSON.stringify({key}) });
        const data = await response.json();
        return data;
    }

}



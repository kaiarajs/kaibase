import { StorageDriver, Sanitize, Exist} from "@hakibase/hakibase"
import fs from "fs";
import ErrnoException = NodeJS.ErrnoException;

export class DiskStorageDriver implements StorageDriver {
    public allKeys: string[];
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
        this.allKeys = [];
        const cwd = process.cwd();
        if (!fs.existsSync(`${cwd}/db/${this.filePath}`)) {
            console.log('not exist, create')
            fs.mkdirSync(`${cwd}/db/${this.filePath}`);
        }
    }

    /**
     * using the cwd use the file path to read the file contents
     * parse the file and return the item with the given key
     * else reject a new error message.
     */
    public getItem(key: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const cwd = process.cwd();
            if (!fs.existsSync(`${cwd}/db/${this.filePath}/${key}.db`)) {
                reject(`No doc with key: ${key} found in ${cwd}/db/${this.filePath}`);
            } else {
                //@ts-ignore
                fs.readFile(`${cwd}/db/${this.filePath}/${key}.db`, "utf8", (err: ErrnoException, data: string) => {
                    if (err) {
                        reject(err);
                    }
                    let a: any;
                    try {
                        a = JSON.parse(data);
                    } catch (e) {
                        reject(e);
                    }
                    resolve(a);
                });
            }
        });
    }
    /**
     * using the cwd use the filepath to write to the file
     * given the key send the data
     * else reject a new error message.
     */
    public setItem(key: string, value: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const cwd = process.cwd();
            let data;
            try {
                data = JSON.stringify(value);
            } catch (e) {
                reject(e);
            }
                //@ts-ignore

            fs.writeFile(`${cwd}/db/${this.filePath}/${key}.db`, data, (err: ErrnoException) => {
                if (err) {
                    reject(err);
                }
                if (this.allKeys.indexOf(key) === -1) {
                    this.allKeys.push(key);
                }
                resolve(value);
            });
        });
    }
    /**
     * This is only for testing
     * using the cwd the file path read in the file convert
     * the file to an object remove the proposed obj and
     * rewrite the file.
     */
    public removeItem(key: string): Promise<any> {
        return new Promise<null>((resolve, reject) => {
            const cwd = process.cwd();
            if (!fs.existsSync(`${cwd}/db/${this.filePath}/${key}.db`)) {
                                //@ts-ignore

                resolve(true);
            } else {
                                //@ts-ignore

                fs.unlink(`${cwd}/db/${this.filePath}/${key}.db`, (err: ErrnoException) => {
                    if (err) {
                        reject(err);
                    }
                    try {
                        this.allKeys = this.allKeys.filter((cur) => cur !== key);
                    } catch (e) {
                        reject(e);
                    }
                    resolve(null);
                });
            }
        });
    }

    /**
     * using the cwd, the file path and the key name create a file
     * name that represents a reference to the associated database file,
     * a reference to the associated object element.
     * example Obj: { "name": "fred", "internal": { "age": 33 } }
     * example filename: BTTindex_users_internal-age.db
     * where the file path of the associated index is "users" and the key
     * given in the method is the path to the element indexed "internal.age".
     */
    public storeIndex(key: string, index: string): Promise<any> {
        return new Promise<null>((resolve, reject) => {
            const cwd = process.cwd();
            const fileName = `${this.filePath}/index_${key}.db`;
            if (index === '[{"key":null,"value":[null]}]' || index === '[{"key":null, "value":[]}]') {
                if (fs.existsSync(`${cwd}/db/${fileName}`)) {
                                    //@ts-ignore

                    fs.unlink(`${cwd}/db/${fileName}`, (err: ErrnoException) => {
                        if (err) {
                            reject(err);
                        }
                        try {
                            this.allKeys = [];
                        } catch (e) {
                            reject(e);
                        }
                        resolve(null);
                    });
                }

            } else {
                                //@ts-ignore

                fs.writeFile(`${cwd}/db/${fileName}`, index, (err: ErrnoException) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(null);
                });
            }

        });
    }
    /**
     * using the cwd, the file path and the key name to create
     * a string that will find the correct file. Then read the contents
     * and return the the stores JSON
     */
    public fetchIndex(key: string): Promise<any[]> {
        return new Promise<any>((resolve, reject) => {
            const cwd = process.cwd();
            const fileName = `${this.filePath}/index_${key}.db`;
            let index: any;
            if (!fs.existsSync(`${cwd}/db/${fileName}`)) {
                resolve([]);
            } else {
                //@ts-ignore
                fs.readFile(`${cwd}/db/${fileName}`, "utf8", (err: ErrnoException, data) => {
                    if (err) {
                        reject(err);
                    }
                    try {
                        index = JSON.parse(data);
                        if (index.length > 0) {
                            index.forEach((obj: any) => {
                                if (obj.value.length === 1) {
                                    if (this.allKeys.indexOf(obj.value[0]) === -1) {
                                        this.allKeys.push(obj.value[0]);
                                    }
                                } else if (obj.value.length > 1 && !(obj.value.length < 0)) {
                                    obj.value.forEach((id: string) => {
                                        if (this.allKeys.indexOf(id) === -1) {
                                            this.allKeys.push(id);
                                        }
                                    });
                                }
                            });
                        }
                    } catch (e) {
                        reject(e);
                    }
                    resolve(index);
                });
            }
        });
    }
    public removeIndex(key: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const cwd = process.cwd();
            const fileName = `index_${key}.db`;
            if (!fs.existsSync(`${cwd}/db/${this.filePath}/${fileName}`)) {
                resolve(true);
            } else {
                                //@ts-ignore
                fs.unlink(`${cwd}/db/${this.filePath}/${fileName}`, (err: ErrnoException) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(true);
                });
            }
        });
    }
    /**
     * Need to have a collection scan. Go over every file in the directory
     * get the Id, pull the dock out an put into iteratorCallback for each file.
     */
    public iterate(iteratorCallback: (key: string, value: any, iteratorNumber?: number) => any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const cwd = process.cwd();
            if (!fs.existsSync(`${cwd}/db/${this.filePath}`)) {
                reject(`No directory at ${this.filePath}`);
            } else {
                                //@ts-ignore
                fs.readdir(`${cwd}/db/${this.filePath}`, (err: ErrnoException, files) => {
                    if (err) {
                        reject(err);
                    }
                    if (files.length > 0) {
                        files.forEach((v) => {
                            try {
                                const fileName = `${cwd}/db/${this.filePath}/${v}`;
                                const data = fs.readFileSync(fileName).toString();
                                if (data) {
                                    const doc = JSON.parse(data);
                                    if (doc.hasOwnProperty("_id")) {
                                        iteratorCallback(doc, doc._id);
                                    }
                                }
                            } catch (e) {
                                reject(e);
                            }
                        });
                    }
                    resolve(true);
                });
            }
        });
    }
    /**
     * Return all the keys = _ids of all documents.
     */
    public keys(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            if (this.allKeys.length === 0) {
                const cwd = process.cwd();
                                //@ts-ignore
                fs.readdir(`${cwd}/db/${this.filePath}`, (err: ErrnoException, files) => {
                    if (err) {
                        return reject(err);
                    }
                    if (files.length > 0) {
                        const ids: string[] = [];
                        files.forEach((v) => {
                            try {
                                const fileName = `${cwd}/db/${this.filePath}/${v}`;
                                const data = fs.readFileSync(fileName).toString();
                                if (data) {
                                    const doc = JSON.parse(data);
                                    if (this.allKeys.indexOf(doc._id) === -1) {
                                        this.allKeys.push(doc._id);
                                        ids.push(doc._id);
                                    }
                                }
                            } catch (e) {
                                reject(e);
                            }
                        });
                        resolve(ids);
                    }
                    resolve([]);
                });
            } else {
                resolve(this.allKeys);
            }
        });
    }

    /**
     * Check for existing file and make sure its contents are readable
     * here is a simple example of just making sure it exists.
     * @param {Isanitize} obj
     * @param index
     * @param {string} fieldName
     * @returns {Promise<any>}
     */
    public exists(obj: Sanitize, index: any, fieldName: string): Promise<Exist> {
        return new Promise((resolve, reject) => {
            const cwd = process.cwd();
            try {
                if (fs.existsSync(`${cwd}/db/${this.filePath}/${obj.value}.db`)) {
                    resolve({key: obj.key, value: obj.value, doesExist: true, index, fieldName});
                } else {
                    resolve({key: obj.key, value: obj.value, doesExist: false, index, fieldName});
                }
            } catch (e) {
                return reject(e);
            }
        });
    }

    /**
     * An extra sanitizer for the storage side as an extra check.
     * NOT used in tedb but is available if need be. It is recommended to
     * have one available for testing and for assurance.
     * @param {string[]} keys
     * @returns {Promise<any>}
     */
    public collectionSanitize(keys: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            const cwd = process.cwd();
            if (!fs.existsSync(`${cwd}/db/${this.filePath}`)) {
                resolve(true);
            } else {
                //@ts-ignore
                fs.readdir(`${cwd}/db/${this.filePath}`, (err: ErrnoException, files) => {
                    if (err) {
                        return reject(err);
                    }
                    const reg = new RegExp("index_");
                    const filteredKeys = files.reduce((acc: string[], file: string) => {
                        if (!reg.test(file)) {
                            const key = String(file).substr(0, String(file).indexOf("."));
                            return acc.concat(key);
                        } else {
                            return acc;
                        }
                    }, []);
                    filteredKeys.forEach((key) => {
                        if (keys.indexOf(key) === -1) {
                            if (fs.existsSync(`${cwd}/db/${this.filePath}/${key}.db`)) {
                                this.allKeys = this.allKeys.filter((cur) => cur !== key);
                                fs.unlinkSync(`${cwd}/db/${this.filePath}/${key}.db`);
                            }
                        }
                    });
                    resolve(true);
                });
            }
        });
    }

    /**
     * Clear collection
     */
    public clear(): Promise<any> {
        return new Promise<null>((resolve, reject) => {
            const cwd = process.cwd();
            if (!fs.existsSync(`${cwd}/db/${this.filePath}`)) {
                resolve(null);
            } else {
                //@ts-ignore
                fs.readdir(`${cwd}/db/${this.filePath}`, (err: ErrnoException, files) => {
                    if (err) {
                        reject(err);
                    }
                    if (files.length > 0) {
                        files.forEach((v) => {
                            const fileName = `${cwd}/db/${this.filePath}/${v}`;
                            try {
                                fs.unlinkSync(fileName);
                            } catch (e) {
                                reject(`Error removing file ${fileName}: ERROR: ${e}`);
                            }
                        });
                    }
                    //@ts-ignore
                    fs.rmdir(`${cwd}/db/${this.filePath}`, (error: ErrnoException) => {
                        if (error) {
                            reject(error);
                        }
                        this.allKeys = [];
                        resolve(null);
                    });
                });
            }
        });
    }
}
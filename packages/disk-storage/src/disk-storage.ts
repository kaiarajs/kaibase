import { StorageDriver, Sanitize, Exist } from "@kaiarajs/kaibase"
import fs, { readdirSync } from "fs";
import tar from 'tar';
import ErrnoException = NodeJS.ErrnoException;

export class DiskStorageDriver implements StorageDriver {
    public allKeys: string[];
    public folderPath: string;
    public collection: string = 'data';
    public fileExtension: string = 'json';

    private databaseName: string = "data"

    constructor(config?: { folderPath?: string, fileExtension?: string }) {

        if (config?.folderPath) {
            this.folderPath = config.folderPath;
        } else {
            this.folderPath = `${process.cwd()}/Kaibase`
        }

        if (config?.fileExtension) {
            this.fileExtension = config.fileExtension;
        }
        this.allKeys = [];
        const cwd = this.folderPath
        if (!fs.existsSync(cwd)) {
            fs.mkdirSync(cwd);
        }
    }

    public setDatabase(name: string) {
        this.databaseName = name;
        const cwd = `${this.folderPath}/${this.databaseName}`
        if (!fs.existsSync(cwd)) {
            fs.mkdirSync(cwd);
        }
        return this
    }

    public getDatabases(): string[] {
        return readdirSync(`${this.folderPath}`, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
    }

    public setCollection(collection: string) {
        this.collection = collection;
        const cwd = `${this.folderPath}/${this.databaseName}/${this.collection}`
        if (!fs.existsSync(cwd)) {
            fs.mkdirSync(cwd);
        }
        return this
    }

    public getCollections(): string[] {
        return readdirSync(`${this.folderPath}/${this.databaseName}`, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
    }

    /**
     * using the cwd use the file path to read the file contents
     * parse the file and return the item with the given key
     * else reject a new error message.
     */
    public getItem(key: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const cwd = `${this.folderPath}/${this.databaseName}/${this.collection}`
            if (!fs.existsSync(cwd)) {
                reject(`No doc with key: ${key} found in ${cwd}`);
            } else {
                //@ts-ignore
                fs.readFile(`${cwd}/${key}.${this.fileExtension}`, "utf8", (err: ErrnoException, data: string) => {
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
            const cwd = `${this.folderPath}/${this.databaseName}/${this.collection}`
            let data;
            try {
                data = JSON.stringify(value);
            } catch (e) {
                reject(e);
            }
            //@ts-ignore
            fs.writeFile(`${cwd}/${key}.${this.fileExtension}`, data, (err: ErrnoException) => {
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
            const cwd = `${this.folderPath}/${this.databaseName}/${this.collection}`
            if (!fs.existsSync(`${cwd}/${key}.${this.fileExtension}`)) {
                //@ts-ignore

                resolve(true);
            } else {
                //@ts-ignore

                fs.unlink(`${cwd}/${key}.${this.fileExtension}`, (err: ErrnoException) => {
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
     * example filename: BTTindex_users_internal-age.${this.fileExtension}
     * where the file path of the associated index is "users" and the key
     * given in the method is the path to the element indexed "internal.age".
     */
    public storeIndex(key: string, index: string): Promise<any> {
        return new Promise<null>((resolve, reject) => {
            const cwd = `${this.folderPath}/${this.databaseName}/${this.collection}`
            const fileName = `${cwd}/index_${key}.${this.fileExtension}`;
            const pte = fileName;

            if (index === '[{"key":null,"value":[null]}]' || index === '[{"key":null, "value":[]}]') {
                if (fs.existsSync(pte)) {
                    //@ts-ignore

                    fs.unlink(pte, (err: ErrnoException) => {
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
                fs.writeFile(pte, index, (err: ErrnoException) => {
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
            const cwd = `${this.folderPath}/${this.databaseName}/${this.collection}`
            const fileName = `${cwd}/index_${key}.${this.fileExtension}`;
            let index: any;
            if (!fs.existsSync(fileName)) {
                resolve([]);
            } else {
                //@ts-ignore
                fs.readFile(fileName, "utf8", (err: ErrnoException, data) => {
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
            const cwd = `${this.folderPath}/${this.databaseName}/${this.collection}`
            const fileName = `index_${key}.${this.fileExtension}`;
            if (!fs.existsSync(`${cwd}/${fileName}`)) {
                resolve(true);
            } else {
                //@ts-ignore
                fs.unlink(`${cwd}/${fileName}`, (err: ErrnoException) => {
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
            const cwd = `${this.folderPath}/${this.databaseName}/${this.collection}`
            if (!fs.existsSync(cwd)) {
                reject(`No directory at ${cwd}`);
            } else {
                //@ts-ignore
                fs.readdir(cwd, (err: ErrnoException, files) => {
                    if (err) {
                        reject(err);
                    }
                    if (files.length > 0) {
                        files.forEach((v) => {
                            try {
                                const fileName = `${cwd}/${v}`;
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
                const cwd = `${this.folderPath}/${this.databaseName}/${this.collection}`
                //@ts-ignore
                fs.readdir(cwd, (err: ErrnoException, files) => {
                    if (err) {
                        return reject(err);
                    }
                    if (files.length > 0) {
                        const ids: string[] = [];
                        files.forEach((v) => {
                            try {
                                const fileName = `${cwd}/${v}`;
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
            const cwd = `${this.folderPath}/${this.databaseName}/${this.collection}`
            try {
                if (fs.existsSync(`${cwd}/${obj.value}.${this.fileExtension}`)) {
                    resolve({ key: obj.key, value: obj.value, doesExist: true, index, fieldName });
                } else {
                    resolve({ key: obj.key, value: obj.value, doesExist: false, index, fieldName });
                }
            } catch (e) {
                return reject(e);
            }
        });
    }

    /**
     * An extra sanitizer for the storage side as an extra check.
     * NOT used in te${this.fileExtension} but is available if need be. It is recommended to
     * have one available for testing and for assurance.
     * @param {string[]} keys
     * @returns {Promise<any>}
     */
    public collectionSanitize(keys: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            const cwd = `${this.folderPath}/${this.databaseName}/${this.collection}`
            if (!fs.existsSync(cwd)) {
                resolve(true);
            } else {
                //@ts-ignore
                fs.readdir(cwd, (err: ErrnoException, files) => {
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
                            if (fs.existsSync(`${cwd}/${key}.${this.fileExtension}`)) {
                                this.allKeys = this.allKeys.filter((cur) => cur !== key);
                                fs.unlinkSync(`${cwd}/${key}.${this.fileExtension}`);
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
            const cwd = `${this.folderPath}/${this.databaseName}/${this.collection}`
            if (!fs.existsSync(cwd)) {
                resolve(null);
            } else {
                //@ts-ignore
                fs.readdir(cwd, (err: ErrnoException, files) => {
                    if (err) {
                        reject(err);
                    }
                    if (files.length > 0) {
                        files.forEach((v) => {
                            const fileName = `${cwd}/${v}`;
                            try {
                                fs.unlinkSync(fileName);
                            } catch (e) {
                                reject(`Error removing file ${fileName}: ERROR: ${e}`);
                            }
                        });
                    }
                    //@ts-ignore
                    fs.rmdir(cwd, (error: ErrnoException) => {
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

    public dump(collections: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            const collectionPaths: string[] = [];
            const cwd = `${this.folderPath}`;
            collections.forEach(element => {
                collectionPaths.push(`${cwd}/${element}`)
            });
            tar.c(
                {
                    gzip: true,
                    file: 'dump.tgz'
                },
                collectionPaths
            )
            .then((data) => resolve(data))
            .catch((err) => reject(err))
        })
    }

}
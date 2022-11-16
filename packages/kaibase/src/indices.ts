import { ASNDBS, SNDBSA, AVLTree } from '@kairajs/binary-tree';
import { ArrayDuplicate, GetObjectValue, CompareArray } from '@kairajs/core';
import { kairajs } from './kairajs';
import { IndexOptions, Range } from './types';

/**
 * Index interface used for the datastore indices
 * Inherits types from binary-type-tree
 *
 * ~~~
 * Array String Number, Date, Boolean, -> symbol was redacted.
 * ASNDBS = Array<any[]|string|number|Date|boolean|null>|string|number|Date|boolean|null
 * -> redacted symbol, Number, Date, Boolean, String, Array
 * SNDBSA = Array<{}|any[]|string|number|Date|boolean|null>;
 * ~~~
 */
export interface IIndex {
    insert(doc: any): Promise<any>;
    insertMany(key: ASNDBS, indices: any[]): Promise<null>;
    updateKey(key: ASNDBS, newKey: ASNDBS): Promise<any>;
    remove(doc: any): Promise<any>;
    removeByPair(key: any, value: string): Promise<any>;
    toJSON(): Promise<string>;
    search(key: ASNDBS): Promise<SNDBSA>;
    traverse(fn: any): Promise<any>;
    searchRange(range: Range): Promise<SNDBSA>;
}

export default class Index implements IIndex {
    /** Field Name for Index */
    protected fieldName: string;
    /** ALV Tree for indexing */
    private avl: AVLTree;
    /** Reference to kairajs */
    private datastore: kairajs;
    /** Is the index holding an array */
    private isArray: boolean;

    /**
     * Constructor
     * @param datastore - reference to kairajs
     * @param options - Options for Index, `{fieldName: string}`
     */
    constructor(datastore: kairajs, options: IndexOptions) {
        this.avl = options.unique ? new AVLTree({ unique: true }) : new AVLTree({});

        if (options.compareKeys) {
            this.avl.compareKeys = options.compareKeys;
        }
        if (options.checkKeyEquality) {
            //@ts-ignore
            this.avl.checkKeyEquality = options.checkKeyEquality;
        }

        this.isArray = false;

        this.fieldName = options.fieldName;
        this.datastore = datastore;
    }

    public traverse(fn: any): Promise<any> {
        //@ts-ignore
        return this.avl.tree.executeOnEveryNode(fn);
    }

    /**
     * Insert document into Index
     * @param doc - document to insert into Index
     * @returns {Promise<any>}
     */
    public insert(doc: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            // TODO: need to make Error types
            if (doc === undefined) {
                return reject(new Error("No document ot insert index"));
            }
            if (!doc.hasOwnProperty("_id")) {
                return reject(new Error("Document is missing _id field"));
            }
            if (typeof doc._id !== "string") {
                return reject(new Error("_id field needs to be type `string`"));
            }

            const key: ASNDBS = GetObjectValue(doc, this.fieldName);
            if (key !== undefined && key !== null) {
                if (Object.prototype.toString.call(key) === "[object Array]" && !this.isArray) {
                    this.avl.compareKeys = CompareArray;
                    this.isArray = true;
                }
            } else {
                return reject(new Error("Key was not retrieved from document, or key was set to null. No null key indices"));
            }
            try {
                this.avl.insert(key, [doc._id]);
            } catch (e) {
                return reject(e);
            }

            resolve(doc);
        });
    }

    /**
     * Inserts many documents and updates the indices
     * @param key
     * @param indices
     * @returns {Promise<null>}
     */
    public insertMany(key: ASNDBS, indices: any[]): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (key !== undefined && key !== null) {
                if (Object.prototype.toString.call(key) === "[object Array]" && !this.isArray) {
                    this.avl.compareKeys = CompareArray;
                    this.isArray = true;
                }
            } else {
                return reject(new Error("Key was not retrieved"));
            }

            try {
                for (const item of indices) {
                    this.avl.insert(item.key, ArrayDuplicate(item.value));
                }
            } catch (e) {
                return reject(e);
            }

            resolve(true);
        });
    }

    /**
     * Update a key of a tree
     * - keys are actually the value, in the tree the keys are values
     * of the to be updated document while the value in the tree is the
     * _id of the to be updated document.
     * @param key
     * @param newKey
     * @returns {Promise<null>}
     */
    public updateKey(key: ASNDBS, newKey: ASNDBS): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (this.avl.tree.search(key).length === 0) {
                return reject(new Error("This key does not exist"));
            }
            try {
                this.avl.updateKey(key, newKey);
            } catch (e) {
                return reject(e);
            }
            resolve(true);
        });
    }

    /**
     * Remove document from Index
     * @param doc
     * @returns {Promise<any>}
     */
    public remove(doc: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (doc === undefined) {
                return reject(new Error("There is no document to remove"));
            }
            if (!doc.hasOwnProperty("_id")) {
                return reject(new Error("There is no _id to reference this document"));
            }

            const key: ASNDBS = GetObjectValue(doc, this.fieldName);

            try {
                this.avl.Delete(key, [doc._id]);
            } catch (e) {
                return reject(e);
            }

            resolve(doc);
        });
    }

    /**
     * Made to remove an indexed item just by the key value pair itself instead
     * of the full object.
     * @param key
     * @param {string} value
     * @returns {Promise<any>}
     */
    public removeByPair(key: any, value: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.avl.Delete(key, [value]);
            } catch (e) {
                return reject(e);
            }
            resolve(true);
        });
    }

    /**
     * Return the tree as JSON [{ key, value }, ...] pairs.
     * @returns {Promise<string>}
     */
    public toJSON(): Promise<string> {
        //@ts-ignore
        return this.avl.tree.toJSON();
    }

    /**
     * Search Index for key
     * @param key
     * @returns {Promise<SNDBSA>}
     */
    public search(key: ASNDBS): Promise<SNDBSA> {
        return new Promise<SNDBSA>((resolve) => {
            resolve(this.avl.tree.search(key));
        });
    }

    /**
     * Search Index within bounds
     * @param range An IRange to search within bounds
     * @returns {Promise<SNDBSA>}
     */
    public searchRange(range: Range): Promise<SNDBSA> {
        return new Promise<SNDBSA>((resolve) => {
            resolve(this.avl.tree.query(range));
        });
    }
}
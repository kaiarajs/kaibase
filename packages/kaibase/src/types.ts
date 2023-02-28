import { ASNDBS } from "@kaiarajs/binary-tree";
import { DefaultCheckKeyEquality, DefaultCompareKeysFunction } from "@kaiarajs/kaibase-core";


export interface Range {
    /**
     * Greater Than
     */
    $gt?: ASNDBS;
    /**
     * Greater Than or Equal
     */
    $gte?: ASNDBS;
    /**
     * Less Than
     */
    $lt?: ASNDBS;
    /**
     * Less Than or Equal
     */
    $lte?: ASNDBS;
    /**
     * Not Equal to
     */
    $ne?: any;
}

/**
 * Argument for index options.
 *
 * ~~~
 * Array String Number, Date, Boolean, -> symbol was redacted. : Used for keys
 * BTT.ASNDBS = Array<any[]|string|number|Date|boolean|null>|string|number|Date|boolean|null
 * -> redacted symbol, Number, Date, Boolean, String, Array : Used for values
 * BTT.SNDBSA = Array<{}|any[]|string|number|Date|boolean|null>;
 * ~~~
 */
 export interface IndexOptions {
    /**
     * The path to the field to be indexed.
     */
    fieldName: string;
    /**
     * Set the index to unique or not
     */
    unique?: boolean;
    /**
     * Method used within the AVL Bt  ree
     *
     * ~~~
     * (a: any, b: any ) => number;
     * ~~~
     * BTT.compareKeys
     * ~~~
     * compareKeys = (a: number | string, b: number | string): number => {
     *   if (a < b) {
     *      return -1;
     *   } else if (a > b) {
     *      return 1;
     *   } else if (a === b) {
     *      return 0;
     *   } else {
     *      throw new Error();
     *   }
     * ~~~
     */
    compareKeys?: typeof DefaultCompareKeysFunction;
    /**
     * Method used within the AVL Btree
     * ~~~
     * (a: ASNDBS, b: ASNDBS ) => boolean;
     * ~~~
     * BTT.checkKeyEquality
     * ~~~
     * checkKeyEquality = (a: number | string | Date, b: number | string | Date): boolean => {
     *      return a === b;
     * }
     * ~~~
     */
    checkKeyEquality?: typeof DefaultCheckKeyEquality;
}

/**
 * Update Options
 */
 export interface UpdateOptions {
    /**
     * default false, if true update many documents
     */
    multi?: boolean;
    /**
     * default false, if true insert the new document
     */
    upsert?: boolean;
    /**
     * default false, if true return all updated documents
     */
    returnUpdatedDocs?: boolean;
    /**
     * used when you want to find a document exactly by the objects
     * contents and if not found insert. different than upsert.
     * With upsert you have to use "dot.notated" and can use $gt queries.
     * with this you can only send and object that you expect to find or
     * insert if not found but only if upsert is set as well. This
     * does not upsert. It just allows you to not use "dot.notated"
     * keys.
     */
    exactObjectFind?: boolean;
}

/**
 * Pluggable Storage Drivers
 * You can create plugins for TeDB to provide different mediums of storage. Below you'll find methods that TeDB will
 * expect in your plugin. Storage plugins implement a simple key-value store.
 */
 export interface StorageDriver {
    /**
     * Set database name
     * @param key
     */
     setDatabase(name: string): void;
      /**
     * Get all databases
     */
    getDatabases(): string[];
     /**
     * Set collection name
     * @param key
     */
    setCollection(name: string): void;
     /**
     * Get all collections
     */
    getCollections(): string[];
    /**
     * Get item by key
     * @param key
     */
    getItem(key: string): Promise<any>;
    /**
     * Insert or Modify key-value pair
     * @param key
     * @param value
     */
    setItem(key: string, value: any): Promise<any>;
    /**
     * Remove item by key
     * @param key
     */
    removeItem(key: string): Promise<null>;
    /**
     * Store the index into its own file
     * @param key - the path to the element in the object
     * @param index - the JSON index
     */
    storeIndex(key: string, index: string): Promise<any>;
    /**
     * Retrieve the JSON from the file to be loaded into the datastore indices
     * @param key - the path to the element in the object
     */
    fetchIndex(key: string): Promise<any[]>;
    /**
     * Remove the saved JSON of a specific Index
     * @param key
     */
    removeIndex(key: string): Promise<null>;
    /**
     * Iterate every key-value pair,
     * IterationCallback should return truthy to break iteration(resulting in promise resolution)
     * IterationCallback should throw exceptions if error occurs, this will be caught by the promise and propagate up
     * the promise chain and handled accordingly. TODO: Add Error types for StorageDrivers
     *
     * @param iteratorCallback - Function to iterate key values pairs, return truthy to break iteration
     */
    iterate(iteratorCallback: (key: string, value: any, iteratorNumber?: number) => any): Promise<any>;
    /**
     * Retrieve all keys - _ids of all documents for this
     */
    keys(): Promise<string[]>;

    /**
     * Sends back an object depending on if the file exists or not
     * -> USED IN THE SANITIZE METHOD
     * _ this helps with removing items from the index if their persistence is not found
     * or if they are not found in general.
     * @param {Isanitize} obj
     * @param index
     * @param {string} fieldName
     * @returns {Promise<Iexist>}
     */
    exists(obj: Sanitize, index: any, fieldName: string): Promise<Exist>;

    /**
     * Should send all keys for this collection of the index.
     * read in all keys of the storage driver and if the key in the storage
     * is not in the list then remove it from storage.
     * a collection without an index will result in a no-op since there
     * is nothing to cross reference.
     * @param {string[]} keys
     * @returns {Promise<any>}
     */
    collectionSanitize(keys: string[]): Promise<null>;
    /**
     * Clear the entire datastore
     */
    clear(): Promise<null>;

    /**
     * Clear the entire datastore
     */
     dump(collections: string[]): Promise<any>;
}

/**
 * Used to insert object into exists -> Key needs to be the search term and value needs t be the values of that
 * search term
 */
export interface Sanitize {
    key: string; // -> search term
    value: unknown; // actual key
}

/**
 * Return object interface for the exists method of the storage driver.
 */
export interface Exist {
    key: ASNDBS | string;
    value: string;
    doesExist: boolean;
    index: unknown;
    fieldName: string;
}


/**
 * General document interface
 */
export interface Doc {
    _id: string;
    [key: string]: unknown;
}
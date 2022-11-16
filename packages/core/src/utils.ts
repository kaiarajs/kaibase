import Base64 from "./base64";

/**
 * Shuffle numbers in array
 * @param nums
 * @returns {number[]}
 */
export const shuffleNumbersArray = (nums: number[]): number[] => {
    let tmp: number;
    let current: number;
    let top: number = nums.length;
    if (top) {
        while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = nums[current];
            nums[current] = nums[top];
            nums[top] = tmp;
        }
    }
    return nums;
};

/**
 * Return an array with the numbers from 0 to n-1, in a random order.
 * @param n
 * @returns {number[]}
 */
export const getRandomArray = (n: number): number[] => {
    const b: number[] = [];
    for (let i = 0; i < n; ++i) {
        b.push(i);
    }
    return shuffleNumbersArray(b);
};

/**
 * Default compareKeys function
 * @param a
 * @param b
 * @returns {number}
 * if a < b then return -1
 * if a > b then return 1
 * if a === b then return 0
 * else throw could not compare error.
 */
export const DefaultCompareKeysFunction = (a: number | string | boolean, b: number | string | boolean): number => {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    } else if (a === b) {
        return 0;
    } else {
        throw new Error(`Could not compare keys, please check types. ${a}:${typeof a}, ${b}:${typeof b}`);
    }
};

/**
 * Default compareValues function
 * @param a
 * @param b
 * @returns {number}
 * if a < b then return -1
 * if a > b then return 1
 * if a === b then return 0
 * else throw could not compare error.
 */
export const DefaultCompareValues = (a: Array<number | string>, b: Array<number | string>): number[] => {
    if (a.length !== b.length) {
        throw new Error(`Cannot compare values of different length. a:${a.length},b:${b.length}, a:${a},b:${b}`);
    } else {
        const returnNum: number[] = [];
        for (let i = a.length - 1; i >= 0; i--) {
            if (a[i] < b[i]) {
                returnNum.push(-1);
            } else if (a[i] > b[i]) {
                returnNum.push(1);
            } else if (a[i] === b[i]) {
                returnNum.push(0);
            } else {
                throw new Error(`Could not compare values, please check types. ${a[i]}:${typeof a[i]}, ${b[i]}:${typeof b[i]}`);
            }
        }
        return returnNum;
    }
};

/**
 * Check whether two keys are equal with '==='
 * @param a
 * @param b
 * @returns {boolean}
 */
export const DefaultCheckKeyEquality = (a: number | string | Date, b: number | string | Date): boolean => {
    return a === b;
};

/**
 * Check whether to values are equal
 * @param a
 * @param b
 * @returns {boolean}
 */
export const DefaultCheckValueEquality = (a: number | string | Date, b: number | string | Date): boolean => {
    return a === b;
};

/**
 * get array with number of items in each row. [1,2,4,8,16] depending
 * on the height of the btree
 * @param height
 * @returns {number[]}
 */
export const GetRowsArrayFromHeight = (height: number): number[] => {
    const returnArr: number[] = [];
    for (let i = 0; i <= height; i++) {
        returnArr.push(Math.pow(2, i));
    }
    return returnArr;
};

/**
 * create an array based on the height of the bTee to insert nodes key
 * and value. example: height 3, [ [], [], [], [] ]. 3-0
 * @param height
 * @returns {any}
 */
export const CreateRefArrayFromTreeHeight = (height: number): any[] => {
    const returnArr: any = [];
    for (let i = 0; i <= height; i++) {
        returnArr.push(new Array(0));
    }
    return returnArr;
};

const fillRefA = (prev: number[], current: number[]): number[] => {
    const a: any[] = [];
    try {
        const prefAOdds = prev.filter((val: number) => (val % 2) !== 0);
        const prefAEvens = prev.filter((val: number) => (val % 2) === 0);
        const currentAOdds = current.filter((val: number) => (val % 2) !== 0);
        const currentAEvens = current.filter((val: number) => (val % 2) === 0);
        const newAOdds = currentAOdds.filter((val: number) => !prefAOdds.includes(val));
        const newAEvens = currentAEvens.filter((val: number) => !prefAEvens.includes(val));
        prefAOdds.forEach((v: any, i: number) => {
            a.push(newAOdds[i]);
            a.push(prefAOdds[i]);
        });
        prefAOdds.forEach((v: any, i: number) => {
            a.push(newAEvens[i]);
            a.push(prefAEvens[i]);
        });
    } catch (e) {
        throw new Error(e);
    }
    return a;
};

/**
 * Create the reference index master array. This tells another method
 * where the nodes need to be inserted in the final array that is turned
 * into JSON.
 * @param refArray
 * @returns {any[]}
 */
export const CreateRandomSortedIndex = (refArray: any[]): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const returnArray: any[] = [];
        try {
            refArray.forEach((val: any, ind: number) => {
                returnArray.push([]);
                refArray[ind].forEach((v: any, i: number) => {
                    returnArray[ind].push(i);
                });
            });

            for (let i = 2; i < returnArray.length; i++) {
                returnArray[i] = fillRefA(returnArray[i - 1], returnArray[i]);
            }
        } catch (e) {
            reject(e);
        }
        resolve(returnArray);
    });
};

/**
 * param a is compared against param b.
 * @param {any[]} a
 * @param {any[]} b
 * @returns {boolean}
 */
export const equalArray = (a: any[], b: any[]): boolean => {
    let newA = a.sort();
    let newB = b.sort();
    newA = newA.map((v) => (Object.prototype.toString.call(v) === "[object Date]") ? v.getTime() : v);
    newB = newB.map((v) => (Object.prototype.toString.call(v) === "[object Date]") ? v.getTime() : v);
    let equal = true;
    for (let i = 0; i < newA.length; i++) {
        equal = equal && (newA[i] === newB[i]);
    }
    return equal;
};

/**
 * Get rid of duplicates in array
 *
 * Example:
 * ~~~
 * const a = [1, 1, 1, 2, 2, 3];
 * const b = rmArrDups(a);
 * console.log(b); // [1, 2, 3];
 * ~~~
 * @param {any[]} arr
 * @returns {any[]}
 */

export function ArrayDuplicate(arr: any[]): any[] {
    const seen: any = {};
    const ret: any = [];
    for (let i = 0; i < arr.length; i++) {
        if (!(arr[i] in seen)) {
            ret.push(arr[i]);
            seen[arr[i]] = true;
        }
    }
    return ret;

}

/**
 * Checks current element if it empty
 *
 * Examples:
 * ~~~
 * isEmpty({}); // true
 * isEmpty([]); // true
 * isEmpty(""); // true
 * isEmpty(null); // true
 * isEmpty(undefined); // true
 * ~~~
 * @param obj
 * @returns {boolean}
 */
export const IsEmpty = (obj: any): boolean => {
    if (!obj && obj !== 0) {
        return true;
    }

    return (!(typeof (obj) === "number") && !Object.keys(obj).length && Object.prototype.toString.call(obj) !== '[object Date]')
};

/**
 * Get value given the Path as "path.to.nested" string
 * @param obj
 * @param path
 */
export const GetObjectValue = (obj: any, path: string) => {
    return path.split(".").reduce((o, i) => {
        if (o !== undefined) {
            return o[i];
        }
    }, obj);
};

/**
 * Private method used in compareArray.
 * @param a
 * @param b
 * @returns {boolean}
 */
const isEqual = (a: any[], b: any[]): boolean => {
    if (a.length !== b.length) {
        return false;
    }

    if (a.length === 0) {
        return true;
    }

    const len = a.length;
    let equal = true;

    for (let i = 0; i < len; i++) {
        const x = a[i];
        const y = b[i];

        equal = equal && (x === y);
    }

    return equal;
};

/**
 * Compare two arrays of equal length, does not deep compare objects in arrays
 *
 * Example:
 * ~~~
 * let equal: number = compareArray([1, 2, 3], [1, 2, 3]); // 0
 * let greater: number = compareArray(["b"], ["a"]); // 1
 * let less: number = compareArray([new Date("1/1/2017")], [new Date()]); // -1
 * ~~~
 * @param a
 * @param b
 * @returns {number}
 */
export const CompareArray = (a: any[], b: any[]): number => {
    const array1 = a;
    const array2 = b;
    for (let i = a.length - 1; i >= 0; i--) {
        if (a[i].constructor.name === "Date") {
            array1[i] = a[i].getTime();
        }
    }
    for (let i = b.length - 1; i >= 0; i--) {
        if (b[i].constructor.name === "Date") {
            array2[i] = b[i].getTime();
        }
    }
    const aStr = array1.toString();
    const bStr = array2.toString();

    if (isEqual(array1, array2)) {
        return 0;
    } else if (aStr < bStr) {
        return -1;
    } else if (aStr > bStr) {
        return 1;
    } else {
        throw new Error("Values cannot be compared");
    }
};

/**
 * Tuple of 4 Uint8Arrays representing 4 serialized Long Unsigned Integers
 */
export type ByteBuffer = [Uint8Array, Uint8Array, Uint8Array, Uint8Array];

const B64 = new Base64();

/**
 * Decodes the Hash into a ByteBuffer
 * @param str
 * @returns {ByteBuffer}
 */
export const decode = (str: string): ByteBuffer => {
    const base64Array: string[] = B64.decode(str).split("=");
    base64Array.pop();

    return [
        decodeB64(base64Array[0]),
        decodeB64(base64Array[1]),
        decodeB64(base64Array[2]),
        decodeB64(base64Array[3]),
    ];
};

/**
 * Encodes a ByteBuffer into a Hash
 * @param buffer
 * @returns {string}
 */
export const encode = (buffer: ByteBuffer): string => {
    const base64Array: string[] = buffer.map((u8: any) => B64.encode(String.fromCharCode.apply(null, u8)));

    return B64.encode(base64Array.join(""));
};

/**
 * Encodes a Hash for a UUID based on date and random numbers
 * @returns {string}
 */
export const GetUUID = (): string => {
    const dateBytes: Uint8Array = NumberToByteArray(Date.now());

    return encode([dateBytes, randomByteArray(), randomByteArray(), randomByteArray()]);
};

/**
 * Retrieve the creation Date from the id
 * @param id
 * @returns {Date}
 */
export const GetDate = (id: string): Date => {
    let time: number = 0;
    const decoded = decode(id);
    const decodedTime = decoded[0];
    for (let i = decodedTime.length - 1; i >= 0; i--) {
        if (decodedTime[i - 2] !== undefined) {
            time = (time + decodedTime[i - 1]) * 256;
        } else if (decodedTime[i - 1] === undefined) {
            time += decodedTime[i];
        }
    }
    return new Date(time);
};

/**
 * Convert base64 into Uint8Array
 * @param b64
 * @returns {Uint8Array}
 */
function decodeB64(b64: string): Uint8Array {
    const decoded = B64.decode(b64).split("").map((c: any) => c.charCodeAt(0));
    decoded.pop();
    return new Uint8Array(decoded);
}

/**
 * Serializes Long Unsigned Integers into Uint8Arrays
 * @param long
 * @returns {Uint8Array}
 * @constructor
 */
function NumberToByteArray(long: number): Uint8Array {
    // we want to represent the input as an 8-byte array
    const byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let index = 0; index < byteArray.length; index++) {
        const byte = long & 0xff;
        byteArray[index] = byte;
        long = (long - byte) / 256;
    }

    return new Uint8Array(byteArray);
}

/**
 * Generate a single Uint8Array representing 2 serialized Long Unsigned Integer.
 * An unsigned long is 4 bytes, 1 byte = 8 bits. 8 bits can create 256 values.
 * @returns {Uint8Array}
 */
function randomByteArray(): Uint8Array {
    const byteArray: number[] = [];
    // hex 100 = 256, math random from 0 to 255;
    byteArray.push(Math.floor(Math.random() * (0x100)));
    byteArray.push(Math.floor(Math.random() * (0x100)));
    byteArray.push(Math.floor(Math.random() * (0x100)));
    byteArray.push(Math.floor(Math.random() * (0x100)));
    byteArray.push(Math.floor(Math.random() * (0x100)));
    byteArray.push(Math.floor(Math.random() * (0x100)));
    byteArray.push(Math.floor(Math.random() * (0x100)));
    byteArray.push(Math.floor(Math.random() * (0x100)));

    return new Uint8Array(byteArray);
}

const IsIndex = (k: any) => {
    return /^\d+/.test(k);
};

const fill = (arr: any[], obj: any, value: any) => {
    const k = arr.shift();
    // k is the first element, which is taken away from arr
    if (arr.length > 0) {
        // arr is empty make the last value an object and it back through.
        // which will create the {name: { of: { nested:
        obj[k] = obj[k] || (IsIndex(arr[0]) ? [] : {});
        // need obj[k] here to have multiple value in one nesting
        // for example: {value: {one: 1, two: 2}}
        fill(arr, obj[k], value);
    } else {
        // finally set final value
        obj[k] = value;
    }
};

/**
 * Expand a dot notated string object into a regular object.
 *
 * Example
 * ~~~
 * const doc = {
 *     "nested.obj.is": "full",
 *     "nested.num": 3,
 *     "tgt.0": 1,
 *     "tgt.1": 2,
 * };
 * const expanded = expandObj(doc);
 * console.log(expanded);
 * // {
 * //     nested: {
 * //         obj: {
 * //             is: "full",
 * //         },
 * //         num: 3,
 * //     },
 * //     tgt: [1, 2],
 * // }
 * ~~~
 * @param obj
 * @returns {any}
 */
export const ExpandObject = (obj: any): any => {
    Object.keys(obj).forEach((k) => {
        // only operate on values that have dot notation
        if (k.indexOf(".") !== -1) {
            fill(k.split("."), obj, obj[k]);
            // and the old "name.of.nested" is deleted at the end in expandObj
            delete obj[k];
        }
    });
    return obj;
};

/**
 * Remove duplicate objects from array comparing certain unique field.
 *
 * Example:
 * ~~~
 * let a = [{_id: 1, name: "ch"}, {_id: 1, name: "ch"}]
 * rmDups(a, "_id"); // [{_id: 1, name: "ch"}]
 * ~~~
 * @param arr
 * @param field
 * @returns {any[]}
 */
 export const ArrObjectsDuplicates = (arr: any[], field: string): any[] => {
    return arr.filter((obj, pos, ray) => {
        return (pos === ray.findIndex((t) => {
            return t[field] === obj[field];
        }));
    });
};

/**
 * un-nest nested arrays
 *
 * Examples
 * ~~~
 * const arr = [[1], [2]];
 * console.log(flattenArr(arr)); // [1, 2];
 *
 * const arr2 = [1, [2], [3, 4, [5]], [[6,[7]]];
 * console.log(flattenArr(arr2); // [1, 2, 3, 4, 5, 6, 7];
 * ~~~
 * @param {any[]} arr
 * @returns {any[]}
 */
 export function FlattenArray(arr: any): any[] {
    const toString = Object.prototype.toString;
    const arrayTypeStr = "[object Array]";

    const result: any = [];
    const nodes = arr.slice();
    let node;

    if (!arr.length) {
        return result;
    }

    node = nodes.pop();

    do {
        if (toString.call(node) === arrayTypeStr) {
            nodes.push.apply(nodes, node);
        } else {
            result.push(node);
        }
    } while (nodes.length && (node = nodes.pop()) !== undefined);

    result.reverse(); // we reverse result to restore the original order
    return result;
}

/**
 * Compress an object into string notation. Used with TeDB's indexing
 *
 * Example
 * ~~~
 * const doc = {
 *     nested: {
 *         obj: {
 *             is: "full",
 *         },
 *         num: 3,
 *     },
 *     tgt: [1, 2],
 * }
 * const target: any = {};
 * compressObj(doc, target);
 * console.log(target);
 * // {
 * //    "nested.obj.is": "full",
 * //    "nested.num": 3,
 * //    "tgt.0": 1,
 * //    "tgt.1": 2,
 * // }
 * ~~~
 *
 * @param obj
 * @param tgt
 * @param {any[]} path
 * @returns {any}
 */
 export const CompressObject = (obj: any, tgt: any = {}, path: any[] = []): any => {
    Object.keys(obj).forEach((key) => {
        if (Object(obj[key]) === obj[key] &&
            (Object.prototype.toString.call(obj[key]) === "[object Object]") ||
            (Object.prototype.toString.call(obj[key]) === "[object Array]")
        ) {
            return CompressObject(obj[key], tgt, path.concat(key));
        } else {
            tgt[path.concat(key).join(".")] = obj[key];
        }
    });
    return tgt;
};

/**
 * Get the duplicate items of two arrays
 *
 * Examples:
 * ~~~
 * let a = [1, 2, 3];
 * let b = [1];
 * let c = getArrDubs(a, b);
 * console.log(c); // [1];
 * ~~~
 * @param {any[]} arr1
 * @param {any[]} arr2
 * @returns {any[]}
 */
 export const GetArrayDuplicates = (arr1: any[], arr2: any[]): any[] => {
    return arr1.filter((val) => arr2.indexOf(val) !== -1);
};

/**
 * Get only duplicates from array of arrays
 *
 * Example:
 * ~~~
 * let a = [[], [], ['a', 'b', 'c']];
 * let b = saveArrDups(a);
 * console.log(b); // [];
 *
 * let a = [['a'], ['a'], ['a', 'b', 'c']];
 * let b = saveArrDups(a);
 * console.log(b); // ['a', 'a', 'a'];
 *
 * let a = [['a', 'a','b','b'], ['c','b','a'],['a','c','b']];
 * let b = saveArrDups(a);
 * console.log(b); // ['a', 'b'];
 * ~~~
 * @param {any[][]} arr
 * @returns {Promise<any[]>}
 */
 export const SaveArrayDups = (arr: any[][]): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        let clear = false;
        const val = arr.reduce((init, item, index) => {
            if (init.length === 0) {
                if (clear) {
                    return init.concat([]);
                } else if (item.length === 0) {
                    clear = true;
                    return init.concat([]);
                } else if (index === 0) {
                    return init.concat(item);
                } else {
                    clear = true;
                    return [];
                }
            } else {
                if (item.length === 0) {
                    clear = true;
                    return [];
                } else {
                    return GetArrayDuplicates(init, item);
                }
            }
        }, []);
        resolve(val);
    });
};


/**
 * Get value given the Path as "path.to.nested" string
 * @param obj
 * @param path
 */
 export const GetObjValue = (obj: any, path: string) => {
    return path.split(".").reduce((o, i) => {
        if (o !== undefined) {
            return o[i];
        }
    }, obj);
};

/**
 * Get the type of element that will be sorted as `[object ${TYPE}]`
 *
 * Examples:
 * ~~~
 * getSortType([{a: 1}], "a"); // [object Number]
 * getSortType([{a: "b"}], "a"); // [object String]
 * getSortType([{a: new Date()}], "a"); // [object Date]
 * getSortType([{a: []}], "a"); // [object Array]
 * getSortType([{a: {}}], "a"); // [object Object]
 * ~~~
 * @param arr - Array to check for type, will not send back a type if null or undefined
 * @param field - field name to check against
 * @returns {string}
 */
 export const GetSortType = (arr: any[], field: string): string => {
    let type: string = "";
    for (const doc of arr) {
        if (doc.hasOwnProperty(field) && doc[field] !== null && doc[field] !== undefined) {
            type = Object.prototype.toString.call(doc[field]);
            break;
        }
    }
    return type;
};

const merge = (left: any[], right: any[], sortField: string, sort: number, type: string) => {
    const result: any[] = [];
    const leftLength: number = left.length;
    const rightLength: number = right.length;
    let l: number = 0;
    let r: number = 0;
    // get the type of field. make sure to get the type from a document that has a filled result
    if (type === "[object Date]" || type === "[object Number]" || type === "[object String]") {
        if (sort === -1) {
            while ( l < leftLength && r < rightLength) {
                if (left[l][sortField] > right[r][sortField]) {
                    result.push(left[l++]);
                } else {
                    result.push(right[r++]);
                }
            }
        } else if (sort === 1) {
            while ( l < leftLength && r < rightLength) {
                if (left[l][sortField] < right[r][sortField]) {
                    result.push(left[l++]);
                } else {
                    result.push(right[r++]);
                }
            }
        }
    } else {
        throw new Error(`Sortable types are [object Date], [object String], and [object Number], this is not a sortable field, ${Object.prototype.toString.call(type)}`);
    }
    return result.concat(left.slice(l)).concat(right.slice(r));
};

/**
 * Sort array of documents using MergeSort
 *
 * Examples:
 * ~~~
 * let docs = [{n: 1}, {n: 6}, {n: 5}];
 * let sort = {n: -1};
 * let key = Object.keys(sort)[0]; // "n"
 * let val = sort[key]; // -1
 * let type = getSortType(docs, key); // "[object Number]"
 * mergeSort(docs, key, val, type); // [{n: 6}, {n: 5}, {n: 1}]
 * ~~~
 * @param toSort - array of documents to sort
 * @param sortField - field name as string from documents
 * @param sortParam - numeric -1 for descending and 1 for ascending sort order
 * @param type - one of the results of Object.prototype.toString.call(obj[field])
 */
export const MergeSort = (toSort: any[], sortField: string, sortParam: number, type: any): any => {
    const len = toSort.length;
    if (len < 2) {
        return toSort;
    }
    const mid = Math.floor(len / 2);
    const left = toSort.slice(0, mid);
    const right = toSort.slice(mid);
    return merge(MergeSort(left, sortField, sortParam, type), MergeSort(right, sortField, sortParam, type), sortField, sortParam, type);
};
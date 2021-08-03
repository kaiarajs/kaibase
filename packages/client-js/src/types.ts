export declare interface Document {
    [key: string]: any;
}

export declare interface HakibaseConfig {
    serverUrl: string;
}

/** @public */
export declare type Sort = string | Exclude<SortDirection, {
    $meta: string;
}> | string[] | {
    [key: string]: SortDirection;
} | Map<string, SortDirection> | [string, SortDirection][] | [string, SortDirection];

/** @public */
export declare type SortDirection = 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending' | {
    $meta: string;
};

export declare type AlternativeType<T> = T extends ReadonlyArray<infer U> ? T | RegExpOrString<U> : RegExpOrString<T>;

/** @public */
export declare type BinarySequence = Uint8Array | Buffer | number[];

/**
 * A class representation of the BSON Binary type.
 * @public
 */
export declare class Binary {
    _bsontype: 'Binary';
    /* Excluded from this release type: BSON_BINARY_SUBTYPE_DEFAULT */
    /** Initial buffer default size */
    static readonly BUFFER_SIZE = 256;
    /** Default BSON type */
    static readonly SUBTYPE_DEFAULT = 0;
    /** Function BSON type */
    static readonly SUBTYPE_FUNCTION = 1;
    /** Byte Array BSON type */
    static readonly SUBTYPE_BYTE_ARRAY = 2;
    /** Deprecated UUID BSON type @deprecated Please use SUBTYPE_UUID */
    static readonly SUBTYPE_UUID_OLD = 3;
    /** UUID BSON type */
    static readonly SUBTYPE_UUID = 4;
    /** MD5 BSON type */
    static readonly SUBTYPE_MD5 = 5;
    /** User BSON type */
    static readonly SUBTYPE_USER_DEFINED = 128;
    buffer: Buffer;
    sub_type: number;
    position: number;
    /**
     * @param buffer - a buffer object containing the binary data.
     * @param subType - the option binary type.
     */
    constructor(buffer?: string | BinarySequence, subType?: number);
    /**
     * Updates this binary with byte_value.
     *
     * @param byteValue - a single byte we wish to write.
     */
    put(byteValue: string | number | Uint8Array | Buffer | number[]): void;
    /**
     * Writes a buffer or string to the binary.
     *
     * @param sequence - a string or buffer to be written to the Binary BSON object.
     * @param offset - specify the binary of where to write the content.
     */
    write(sequence: string | BinarySequence, offset: number): void;
    /**
     * Reads **length** bytes starting at **position**.
     *
     * @param position - read from the given position in the Binary.
     * @param length - the number of bytes to read.
     */
    read(position: number, length: number): BinarySequence;
    /**
     * Returns the value of this binary as a string.
     * @param asRaw - Will skip converting to a string
     * @remarks
     * This is handy when calling this function conditionally for some key value pairs and not others
     */
    value(asRaw?: boolean): string | BinarySequence;
    /** the length of the binary sequence */
    length(): number;
    /* Excluded from this release type: toJSON */
    /* Excluded from this release type: toString */
    /* Excluded from this release type: toExtendedJSON */
    /* Excluded from this release type: toUUID */
    /* Excluded from this release type: fromExtendedJSON */
    inspect(): string;
}

/** @public */
export declare type BitwiseFilter = number /** numeric bit mask */ | Binary /** BinData bit mask */ | number[];


/** @public */
export declare const BSONType: Readonly<{
    readonly double: 1;
    readonly string: 2;
    readonly object: 3;
    readonly array: 4;
    readonly binData: 5;
    readonly undefined: 6;
    readonly objectId: 7;
    readonly bool: 8;
    readonly date: 9;
    readonly null: 10;
    readonly regex: 11;
    readonly dbPointer: 12;
    readonly javascript: 13;
    readonly symbol: 14;
    readonly javascriptWithScope: 15;
    readonly int: 16;
    readonly timestamp: 17;
    readonly long: 18;
    readonly decimal: 19;
    readonly minKey: -1;
    readonly maxKey: 127;
}>;

/** @public */
export declare type BSONType = typeof BSONType[keyof typeof BSONType];

/** @public */
export declare type BSONTypeAlias = keyof typeof BSONType;



/** @public */
export declare interface FilterOperators<TValue> extends Document {
    $eq?: TValue;
    $gt?: TValue;
    $gte?: TValue;
    $in?: TValue[];
    $lt?: TValue;
    $lte?: TValue;
    $ne?: TValue;
    $nin?: TValue[];
    $not?: TValue extends string ? FilterOperators<TValue> | RegExp : FilterOperators<TValue>;
    /**
     * When `true`, `$exists` matches the documents that contain the field,
     * including documents where the field value is null.
     */
    $exists?: boolean;
    $type?: BSONType | BSONTypeAlias;
    $expr?: Record<string, any>;
    $jsonSchema?: Record<string, any>;
    $mod?: TValue extends number ? [number, number] : never;
    $regex?: TValue extends string ? RegExp | BSONRegExp | string : never;
    $options?: TValue extends string ? string : never;
    $geoIntersects?: {
        $geometry: Document;
    };
    $geoWithin?: Document;
    $near?: Document;
    $nearSphere?: Document;
    $maxDistance?: number;
    $all?: TValue extends ReadonlyArray<any> ? any[] : never;
    $elemMatch?: TValue extends ReadonlyArray<any> ? Document : never;
    $size?: TValue extends ReadonlyArray<any> ? number : never;
    $bitsAllClear?: BitwiseFilter;
    $bitsAllSet?: BitwiseFilter;
    $bitsAnyClear?: BitwiseFilter;
    $bitsAnySet?: BitwiseFilter;
    $rand?: Record<string, never>;
}
export declare class BSONRegExp {
    _bsontype: 'BSONRegExp';
    pattern: string;
    options: string;
    /**
     * @param pattern - The regular expression pattern to match
     * @param options - The regular expression options
     */
    constructor(pattern: string, options?: string);
    static parseOptions(options?: string): string;
}

export declare type RegExpOrString<T> = T extends string ? BSONRegExp | RegExp | T : T;

export declare type Condition<T> = AlternativeType<T> | FilterOperators<AlternativeType<T>>;

/** @public */
export declare interface RootFilterOperators<TSchema> extends Document {
    $and?: Filter<TSchema>[];
    $nor?: Filter<TSchema>[];
    $or?: Filter<TSchema>[];
    $text?: {
        $search: string;
        $language?: string;
        $caseSensitive?: boolean;
        $diacriticSensitive?: boolean;
    };
    $where?: string | ((this: TSchema) => boolean);
    $comment?: string | Document;
}

export declare type Filter<TSchema> = {
    [P in keyof TSchema]?: Condition<TSchema[P]>;
} & RootFilterOperators<TSchema>;


export declare interface DbResponse {
    success: boolean;
    data: Document | Document[]
}
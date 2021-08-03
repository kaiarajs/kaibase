import { Document, Filter, Sort } from "mongodb";

export interface HeadersDb {
    'collection': string;
}

export interface QuerystringDb {
    filter?: Filter<Document>
}

export interface QuerystringDbGet {
    filter?: Filter<Document>,
    sort?: Sort,
    limit?: number
}
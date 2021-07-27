import { Document, Filter } from "mongodb";

export interface HeadersDb {
    'collection': string;
}

export interface QuerystringDb {
    filter?: Filter<Document>
}
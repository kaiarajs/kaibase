import { ObjectId } from "mongodb";

export interface TokenModel {
    token: string
    userId: ObjectId
    allowedRefresh: boolean
}
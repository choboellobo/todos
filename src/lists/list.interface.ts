import { Document, ObjectId } from "mongoose";

export interface IList extends Document {
    name: string
    owner: ObjectId
    allows: [ObjectId]
}
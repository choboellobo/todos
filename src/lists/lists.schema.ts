import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

@Schema({timestamps: true})
export class List {
    @Prop({required: true})
    name: string

    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    owner: string

    @Prop({unique: true, type: [mongoose.Schema.Types.ObjectId], ref: 'User'})
    allows: [string]
}

export const ListSchema = SchemaFactory.createForClass(List)

ListSchema.set('toJSON', {
    transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
})
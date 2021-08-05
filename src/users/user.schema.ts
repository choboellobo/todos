import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IUser } from "./user.interface";
import * as bcrypt from 'bcrypt';

@Schema({timestamps: true})
export class User {
    @Prop({required: true})
    name: string

    @Prop({required: true, unique: true})
    email: string

    @Prop({required: true, select: false })
    password: string

    @Prop()
    roles: [string]
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<IUser>('save', function(next) {
    if(this.password) {
        bcrypt.genSalt(10, (err, salt) => {
            if(err) return next(err);
            bcrypt.hash(this.password, salt, (err, hash) => {
                if(err) return next(err);
                this.password = hash;
                next();
            })
        })
    }
})

UserSchema.set('toJSON', {
    transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password
      }
})
 
import { Document, Schema, models, model } from 'mongoose'

export interface IUser extends Document {
    name: string
    email: string
    password: string
    createdAt: Date
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: () => new Date(),
        },
    },
    { timestamps: true }
)

const User = models.User || model<IUser>('User', UserSchema)

export default User

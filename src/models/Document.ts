import mongoose, { Schema, models, model } from 'mongoose'

export interface IDocument extends Document {
    title: string
    description: string
    fileUrl: string
    fileId: string
    owner: Schema.Types.ObjectId
    sharedWith: [Schema.Types.ObjectId]
    isPublic: boolean
}

const DocumentSchema = new Schema<IDocument>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileId: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    sharedWith: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
}, {
    timestamps: true,
});


const Document = models.Document || model<IDocument>('Document', DocumentSchema)

export default Document


import mongoose, { Schema, models, model } from 'mongoose';

export interface IComment extends Document {
    content: string;
    document: Schema.Types.ObjectId;
    author: Schema.Types.ObjectId;
    parentComment: Schema.Types.ObjectId | null;
    replies: Schema.Types.ObjectId[];
    isEdited: boolean;
    likes: Schema.Types.ObjectId[];
}

const CommentSchema = new Schema<IComment>(
    {
        content: {
            type: String,
            required: true,
            trim: true,
        },
        document: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Document',
            required: true,
            index: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: null,
        },
        replies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
        isEdited: {
            type: Boolean,
            default: false,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    }
);


CommentSchema.index({ document: 1, createdAt: -1 });
CommentSchema.index({ parentComment: 1, createdAt: -1 });

const Comment = models.Comment || model<IComment>('Comment', CommentSchema);

export default Comment;
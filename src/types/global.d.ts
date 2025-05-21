import { ObjectId } from "mongodb";

interface PdfDocumentType {
    _id: ObjectId;
    title: string;
    fileUrl: string;
    fileId: string;
    owner: ObjectId;
    isPublic: boolean;
    sendEmail: boolean;
    sharedWith?: ObjectId[];
    replies?: string[];
    parentComment?: ObjectId | null;
    createdAt?: string;
    updatedAt?: string;
}

interface EnrichedComment {
    _id: string;
    document: string;
    author: {
        name: string;
        image: string | null;
    };
    content: string;
    createdAt: string;
    parentComment?: string | null;
    replies: EnrichedComment[];
    replyCount?: number;
  }
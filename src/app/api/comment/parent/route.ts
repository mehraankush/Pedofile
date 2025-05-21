import jwt from 'jsonwebtoken';
import { Db, ObjectId } from 'mongodb';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { IUser } from '@/models/User';


const JWT_SECRET = process.env.JWT_SECRET!


interface Comment {
    _id: ObjectId;
    document: ObjectId;
    author: ObjectId;
    content: string;
    createdAt: Date;
    parentComment?: ObjectId | null;
    replies: ObjectId[];
}

export async function GET(req: NextRequest) {
    try {

        const url = new URL(req.url);
        const commentId = url.searchParams.get('id');


        if (!commentId || !ObjectId.isValid(commentId)) {
            return NextResponse.json(
                { success: false, message: 'Invalid comment ID' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();


        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { user: IUser };

        if (!decoded || !decoded.user) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const parentComment = await db.collection<Comment>('Comment').findOne({
            _id: new ObjectId(commentId),
        });

        if (!parentComment) {
            return NextResponse.json(
                { success: false, message: 'Parent comment not found' },
                { status: 404 }
            );
        }

        const documentId = parentComment.document;

        // Verify access to the document
        const document = await db.collection('Document').findOne({
            _id: documentId,
        });

        if (!document) {
            return NextResponse.json(
                { success: false, message: 'Document not found' },
                { status: 404 }
            );
        }

        const userId = decoded.user._id;
        const hasAccess =
            document.owner?.toString() === userId ||
            (document.sharedWith?.includes(userId)) ||
            document.isPublic;

        if (!hasAccess) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'You do not have permission to view comments',
                },
                { status: 403 }
            );
        }

        // Define the comments filter to get replies for the specified commentId
        const commentsFilter = {
            document: documentId,
            parentComment: new ObjectId(commentId),
        };

        // Fetch enriched replies using getEnrichedComments
        const enrichedReplies = await getEnrichedComments(db, commentsFilter, commentId);

        return NextResponse.json(
            { success: true, comments: enrichedReplies },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching comment replies:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch comment replies' },
            { status: 500 }
        );
    }
}



async function getEnrichedComments(
    db: Db, 
    commentsFilter: { document: ObjectId; parentComment: ObjectId | null },
    parentId?: string
) {
    const enrichedComments = await db.collection('Comment').aggregate([
        // Step 1: Match comments based on filter
        {
            $match: commentsFilter,
        },
        // Step 2: Sort by createdAt (descending)
        {
            $sort: { createdAt: -1 },
        },
        // Step 3: Lookup author details from users collection
        {
            $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'authorData',
            },
        },
        // Step 4: Unwind authorData
        {
            $unwind: {
                path: '$authorData',
                preserveNullAndEmptyArrays: true,
            },
        },
        // Step 5: Lookup reply count
        {
            $lookup: {
                from: 'Comment',
                let: { commentId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$parentComment', '$$commentId'] },
                        },
                    },
                    {
                        $count: 'replyCount',
                    },
                ],
                as: 'replyData',
            },
        },
        // Step 6: Unwind replyData
        {
            $unwind: {
                path: '$replyData',
                preserveNullAndEmptyArrays: true,
            },
        },
        // Step 7: Project the final output
        {
            $project: {
                _id: 1,
                document: 1,
                content: 1,
                author: {
                    name: { $ifNull: ['$authorData.name', 'Unknown'] },
                    image: { $ifNull: ['$authorData.image', null] },
                },
                createdAt: 1,
                parentComment: 1,
                replies: 1, // Include the replies array (ObjectIds)
                replyCount: parentId ? undefined : { $ifNull: ['$replyData.replyCount', 0] },
            },
        },
    ]).toArray();

    return enrichedComments;
}

// export { getEnrichedComments };
import jwt from 'jsonwebtoken'
import { cookies } from "next/headers";
import { Db, ObjectId } from "mongodb";
import { IUser } from '@/models/User';
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!


export async function POST(req: NextRequest) {
    try {

        const { content, id: documentId, parentCommentId = null } = await req.json();

        if (!content || !documentId) {
            return NextResponse.json({
                success: false,
                message: 'Missing required fields'
            }, { status: 400 });
        }

        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value

        if (!token) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized'
            }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { user: IUser };

        if (!decoded || !decoded.user) {
            return NextResponse.json({
                success: false, message: 'Unauthorized'
            }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();

        const document = await db.collection("Document").findOne({ _id: new ObjectId(documentId) });

        if (!document) {
            return NextResponse.json({
                success: false,
                message: 'Document not found'
            }, { status: 404 });
        }

        if (document.replies.length >= 5) {
            return NextResponse.json({
                success: false,
                message: 'Maximum number of replies reached'
            }, { status: 400 });
        }

        const userId = decoded.user._id as string;

        const hasAccess =
            document.owner?.toString() === userId ||
            document.sharedWith?.includes(userId) ||
            document.isPublic;

        if (!hasAccess) {
            return NextResponse.json({
                success: false,
                message: 'You do not have permission to comment on this document'
            }, { status: 403 });
        }

        const commentData = {
            content,
            document: new ObjectId(documentId),
            author: new ObjectId(userId),
            parentComment: parentCommentId ? new ObjectId(parentCommentId) : null,
            createdAt: new Date(),
            updatedAt: new Date(),
            replies: [],
        };

        const commentInsertResult = await db.collection("Comment").insertOne(commentData);
        const newComment = await db.collection("Comment").findOne({ _id: commentInsertResult.insertedId });

        // if this is a reply
        if (parentCommentId) {
            await db.collection<Comment>('Comment').updateOne(
                { _id: new ObjectId(parentCommentId) },
                { $push: { replies: commentInsertResult.insertedId } }
            );
        }

        const populatedComment = {
            ...newComment,
            author: {
                _id: decoded.user._id,
                name: decoded.user.name,
                email: decoded.user.email,
            },
        };

        return NextResponse.json({
            success: true,
            comment: populatedComment
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to create comment'
        }, { status: 500 });
    }
}

export async function GET(
    req: NextRequest,
) {
    try {

        const url = new URL(req.url);
        const documentId = url.searchParams.get('id');
        const parentId = url.searchParams.get("parentId");

        if (!documentId || !ObjectId.isValid(documentId)) {
            return NextResponse.json(
                { success: false, message: "Invalid document ID" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();

        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value

        if (!token) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized'
            }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { user: IUser };

        if (!decoded || !decoded.user) {
            return NextResponse.json({
                success: false, message: 'Unauthorized'
            }, { status: 401 });
        }

        const document = await db.collection("Document").findOne({
            _id: new ObjectId(documentId),
        });

        if (!document) {
            return NextResponse.json(
                { success: false, message: "Document not found" },
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
                    message: "You do not have permission to view comments"
                },
                { status: 403 }
            );
        }

        const query = {
            document: new ObjectId(documentId),
            parentComment: parentId ? new ObjectId(parentId) : null,
        };

        const response = await getEnrichedComments(db, query, parentId);

        return NextResponse.json({
            success: true,
            comments: response
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch comments" },
            { status: 500 }
        );
    }
}


async function getEnrichedComments(
    db: Db,
    commentsFilter: { document: ObjectId; parentComment: ObjectId | null },
    parentId?: string | null
) {

    const enrichedComments = await db.collection('Comment').aggregate([

        {
            $match: commentsFilter, // e.g., { _id: { $in: commentIds } } or {}
        },
        // Step 2: Lookup author details from the users collection
        {
            $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'authorData',
            },
        },
        // Step 3: Unwind authorData to simplify the structure (optional, if you expect one author per comment)
        {
            $unwind: {
                path: '$authorData',
                preserveNullAndEmptyArrays: true, // Keep comments even if no author is found
            },
        },
        // Step 4: Lookup reply count by counting documents with matching parentComment
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
        // Step 5: Unwind replyData to extract the count (optional, handles empty replies)
        {
            $unwind: {
                path: '$replyData',
                preserveNullAndEmptyArrays: true,
            },
        },
        // Step 6: Lookup and populate replies if replies field contains IDs
        {
            $lookup: {
                from: 'Comment',
                let: { replyIds: '$replies' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $isArray: '$$replyIds' },
                                    { $in: ['$_id', '$$replyIds'] }
                                ]
                            }
                        }
                    },
                    // Lookup author data for each reply
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'author',
                            foreignField: '_id',
                            as: 'authorData',
                        },
                    },
                    {
                        $unwind: {
                            path: '$authorData',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    // Project reply fields
                    {
                        $project: {
                            _id: 1,
                            content: 1,
                            createdAt: 1,
                            parentComment: 1,
                            author: {
                                name: { $ifNull: ['$authorData.name', 'Unknown'] },
                                email: { $ifNull: ['$authorData.email', 'Unknown'] },
                            },
                        },
                    }
                ],
                as: 'populatedReplies',
            },
        },
        // Step 7: Project the final output
        {
            $project: {
                // Include all original comment fields
                ...Object.fromEntries(
                    Object.keys(/* your Comment schema */ {
                        _id: 1,
                        content: 1,
                        author: 1,
                        createdAt: 1,
                        parentComment: 1,
                        replies: 1,
                    }).map((key) => [key, 1])
                ),
                // Add enriched author fields
                author: {
                    name: { $ifNull: ['$authorData.name', 'Unknown'] },
                    email: { $ifNull: ['$authorData.email', 'Unknown'] },
                },
                // Conditionally include replyCount if parentId is not provided
                replyCount: parentId
                    ? undefined
                    : { $ifNull: ['$replyData.replyCount', 0] },
                // Replace replies field with populated replies if they exist, otherwise keep original
                replies: {
                    $cond: {
                        if: { $gt: [{ $size: { $ifNull: ['$populatedReplies', []] } }, 0] },
                        then: '$populatedReplies',
                        else: '$replies'
                    }
                }
            },
        },
    ]).toArray();

    return enrichedComments;
}
import jwt from 'jsonwebtoken'
import { ObjectId } from "mongodb";
import { IUser } from "@/models/User";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
// import { sendShareEmail } from "./Utils";


const JWT_SECRET = process.env.JWT_SECRET!
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { shareType, email, documentId } = body;

        console.log("body data ", shareType, email, documentId)

        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value
        if (!token) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized'
            }, { status: 401 })
        }

        // const decodedToken = jwt.verify(token, JWT_SECRET) as { user: IUser }

        const client = await clientPromise
        const db = client.db();

        const document = await db
            .collection('Document')
            .findOne({ _id: new ObjectId(documentId) });

        if (!document) {
            return NextResponse.json({
                success: false,
                message: 'Document not found',
            }, { status: 404 });
        }

        // Handle public sharing
        if (shareType === 'public') {

            await db.collection('Document').updateOne(
                { _id: new ObjectId(documentId) },
                { $set: { isPublic: true } }
            );

            return NextResponse.json({
                success: true,
                message: 'Document is now public',
                publicUrl: `${BASE_URL}/shared/${document._id}`
            }, { status: 200 });
        }

        // Handle individual sharing
        if (shareType === 'individual') {
            if (!email) {
                return NextResponse.json({
                    success: false,
                    message: 'Email is required for individual sharing'
                }, { status: 400 });
            }

            // Find the user by email
            const targetUser = await db
                .collection('users')
                .findOne({ email: email.toLowerCase() })

            if (!targetUser) {
                return NextResponse.json({
                    success: false,
                    message: 'User not found with this email'
                }, { status: 404 });
            }

            // Add user to sharedWith array
            if (!document.sharedWith) {
                document.sharedWith = [];
            }

            // Check if already shared with this user
            if (document.sharedWith.includes(targetUser._id)) {
                return NextResponse.json({
                    success: false,
                    message: 'Document already shared with this user'
                }, { status: 400 });
            }


            await db.collection('Document').updateOne(
                { _id: new ObjectId(documentId) },
                {
                    $addToSet: { sharedWith: targetUser._id },
                }
            );

            const sendEmail = document.sendEmail;
            console.log("sendEmail", sendEmail)

            // Send email notification
            // if (sendEmail !== true) {
            //     try {
            //         console.log("inside send mail")
            //         await sendShareEmail(
            //             email,
            //             document,
            //             document._id,
            //             decodedToken.user.name,
            //             decodedToken.user.email
            //         );

            //         await db.collection('Document').updateOne(
            //             { _id: new ObjectId(documentId) },
            //             { $set: { sendEmail: true } }
            //         );

            //     } catch (emailError) {
            //         console.error('Failed to send share email:', emailError);
            //     }
            // }

            return NextResponse.json({
                success: true,
                message: 'Document shared successfully',
                sharedWith: targetUser._id
            }, { status: 200 });
        }

        return NextResponse.json({
            success: false,
            message: 'Invalid share type'
        },
            { status: 400 });

    } catch (error) {
        console.error("Error uploading file:", error)
        return NextResponse.json({
            success: false,
            error: "Failed to share file"
        },
            { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const documentId = url.searchParams.get("id");

        if (!documentId) {
            return NextResponse.json(
                { success: false, message: "Document ID is required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();

        const document = await db
            .collection("Document")
            .findOne({ _id: new ObjectId(documentId) });

        if (!document) {
            return NextResponse.json(
                { success: false, message: "Document not found" },
                { status: 404 }
            );
        }

        const owner = await db
            .collection("users")
            .findOne({ _id: new ObjectId(document.owner) });

        // If public, skip auth and return immediately
        if (document.isPublic === true) {

            return NextResponse.json(
                {
                    success: true,
                    data: {
                        ...document,
                        owner: {
                            name: owner?.name,
                            email: owner?.email,
                        },
                        publicUrl: `${BASE_URL}/shared/${document._id}`,
                    },
                },
                { status: 200 }
            );
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decodedToken = jwt.verify(token, JWT_SECRET) as { user: IUser };
        const currentUserId = decodedToken.user._id;

        const isOwner = document.owner?.toString() === currentUserId;
        const isSharedWithUser = document.sharedWith?.some(
            (id: string | ObjectId) => id.toString() === currentUserId
        );

        const hasAccess = isOwner || isSharedWithUser;

        if (!hasAccess) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You do not have permission to access this document",
                    accessLevel: "none",
                },
                { status: 403 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: {
                    ...document,
                    owner: {
                        name: owner?.name,
                        email: owner?.email,
                    },
                    publicUrl: null,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error checking document permissions:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
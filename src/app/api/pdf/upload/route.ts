import { Readable } from 'stream';
import { google } from "googleapis";
import { serviceAccount } from "./keys";
import { type NextRequest, NextResponse } from "next/server"
import Document from '@/models/Document';
import { cookies } from 'next/headers';

import jwt from 'jsonwebtoken'
import { IUser } from '@/models/User'
import clientPromise from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET!


export async function POST(request: NextRequest) {
    try {

        const formData = await request.formData()
        const file = formData.get("file") as File | null

        if (!file) {
            return NextResponse.json({
                success: false,
                error: "No file provided"
            },
                { status: 400 }
            )
        }

        const viewLink = await UploadFileToGoogleDrive(file);

        const user = await getUser();
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User not found',
                },
                { status: 401 }
            )
        }

        const client = await clientPromise
        const db = client.db()

        const newPdfUpload = new Document({
            title: viewLink.fileName,
            fileId: viewLink.fileId,
            fileUrl: viewLink.webViewLink,
            owner: user._id,
        });

         await db.collection('Document').insertOne(newPdfUpload)


        return NextResponse.json(
            {
                success: true,
                webViewLink: viewLink.webViewLink,
                message: "File uploaded successfully!",
            },
            { status: 201 },
        )
    } catch (error) {
        console.error("Error uploading file:", error)
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }
}


const getUser = async () => {

    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value

        if (!token) {
            console.log("No token found")
            return null;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { user: IUser }

        return decoded.user
    } catch (error) {
        console.error('Error fetching user info:', error)
        return null
    }

}

// Function to authenticate Google Auth
const authenticateGoogle = async () => {
    try {
        return new google.auth.GoogleAuth({
            // keyFile:  './src/action/keys.json',
            credentials: serviceAccount,
            scopes: ["https://www.googleapis.com/auth/drive"]
        });
    } catch (error) {
        console.error("Authentication Error:", error);
        throw error;
    }
};

// Convert Buffer to Readable Stream
const bufferToStream = (buffer: Buffer) => {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
};

 async function UploadFileToGoogleDrive(fileAttachment: File) {
    try {
        if (!fileAttachment) {
            throw new Error("No file uploaded.");
        }

        // Validate file size (5MB limit)
        if (fileAttachment.size > 25 * 1024 * 1024) {
            throw new Error("File size exceeds 25MB limit.");
        }

        // Convert File to Buffer
        const bytes = await fileAttachment.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload directly to Google Drive
        const result = await uploadToGoogleDrive(buffer, fileAttachment.name, fileAttachment.type);

        console.log("File uploaded to Google Drive:", result);

        return {
            success: true,
            message: "File uploaded successfully",
            fileId: result.id,
            fileName: result.name,
            webViewLink: result.webViewLink
        };

    } catch (error) {
        console.error("Error in upload:", error);
        throw error;
    }
}


// Upload file to Google Drive
const uploadToGoogleDrive = async (fileBuffer: Buffer, fileName: string, mimeType: string) => {
    const auth = await authenticateGoogle();
    const driveService = google.drive({ version: "v3", auth });

    const fileMetadata = {
        name: fileName,
        parents: [`${process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID}`]
    };

    try {
        const response = await driveService.files.create({
            requestBody: fileMetadata,
            media: {
                mimeType: mimeType,
                body: bufferToStream(fileBuffer)
            },
            fields: "id,name,webViewLink",
        });

        return response.data;
    } catch (error) {
        console.error("Upload Error:", error);
        throw error;
    }
};


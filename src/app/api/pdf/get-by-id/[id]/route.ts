import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: documentId } = await params;

        if (!documentId) {
            return NextResponse.json(
                { success: false, message: "Document ID is required" },
                { status: 400 }
            );
        }

        const client = await clientPromise
        const db = client.db()
        
        const document = await db
            .collection("Document")
            .findOne({ _id: new ObjectId(documentId) });

    
        if (!document) {
            return NextResponse.json(
                { success: false, message: "Document not found" },
                { status: 404 }
            );
        }
        
        const userId =  new ObjectId(document.owner);

        const owner = await db
            .collection("users")
            .findOne({ _id: userId });

   
        return NextResponse.json(
            { success: true, data: {
                ...document,
                owner: {
                    name: owner?.name,
                    email: owner?.email,
                },
            } },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching document:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}

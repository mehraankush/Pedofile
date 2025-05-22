import crypto from "crypto";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendResetEmail } from "../../share/Utils";


export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        const client = await clientPromise;
        const db = client.db();

        const user = await db.collection("users").findOne({ email });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expiry = Date.now() + 3600000; // 1 hour

        await db.collection("users").updateOne(
            { _id: user._id },
            { $set: { resetPasswordToken: token, resetPasswordExpires: expiry } }
        );

        const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

        await sendResetEmail(email, resetLink);

        return NextResponse.json({ success: true, message: "Reset email sent" });
    } catch (error) {
        console.error("Error in request-reset API:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

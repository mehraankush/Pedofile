import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();
        const client = await clientPromise;
        const db = client.db();

        const user = await db.collection("users").findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Token is invalid or expired"
            }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.collection("users").updateOne(
            { _id: user._id },
            {
                $set: { password: hashedPassword },
                $unset: { resetPasswordToken: "", resetPasswordExpires: "" }
            }
        );

        return NextResponse.json({
            success: true,
            message: "Password has been reset"
        }, { status: 200 });

    } catch (error) {
        console.error("Error in reset-password API:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}

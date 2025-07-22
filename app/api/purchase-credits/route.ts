import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";

export async function POST(req: NextRequest) {
    try {
        const { email, creditsToAdd } = await req.json();

        if (!email || !creditsToAdd || creditsToAdd <= 0) {
            return NextResponse.json(
                { error: "Invalid email or credits amount" },
                { status: 400 }
            );
        }

        // Get current user credits
        const userResult = await db.select().from(usersTable)
            .where(eq(usersTable.email, email));

        if (userResult.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const currentCredits = userResult[0].credits || 0;
        const newCredits = currentCredits + creditsToAdd;

        // Update user credits
        const updateResult = await db.update(usersTable)
            .set({ credits: newCredits })
            .where(eq(usersTable.email, email))
            .returning({ 
                id: usersTable.id,
                name: usersTable.name,
                email: usersTable.email,
                credits: usersTable.credits
            });

        return NextResponse.json({
            success: true,
            previousCredits: currentCredits,
            newCredits: newCredits,
            creditsAdded: creditsToAdd,
            user: updateResult[0]
        });

    } catch (error) {
        console.error("Error purchasing credits:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { error: "Email parameter is required" },
                { status: 400 }
            );
        }

        const userResult = await db.select().from(usersTable)
            .where(eq(usersTable.email, email));

        if (userResult.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            credits: userResult[0].credits || 0,
            user: userResult[0]
        });

    } catch (error) {
        console.error("Error fetching user credits:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
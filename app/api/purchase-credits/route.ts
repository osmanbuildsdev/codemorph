import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { eq, sql } from "drizzle-orm";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";

// Admin-only endpoint for topping up a user's credits after a purchase request.
// Requires the "x-admin-secret" header to match the ADMIN_SECRET env variable.
function isAdmin(req: NextRequest) {
    const secret = process.env.ADMIN_SECRET;
    const provided = req.headers.get("x-admin-secret");
    if (!secret || !provided) return false;

    const a = Buffer.from(provided);
    const b = Buffer.from(secret);
    return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
    if (!isAdmin(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { email, creditsToAdd } = await req.json();

        if (!email || !Number.isInteger(creditsToAdd) || creditsToAdd <= 0) {
            return NextResponse.json(
                { error: "Invalid email or credits amount" },
                { status: 400 }
            );
        }

        const updateResult = await db.update(usersTable)
            .set({ credits: sql`coalesce(${usersTable.credits}, 0) + ${creditsToAdd}` })
            .where(eq(usersTable.email, email))
            .returning({
                id: usersTable.id,
                name: usersTable.name,
                email: usersTable.email,
                credits: usersTable.credits
            });

        if (updateResult.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            newCredits: updateResult[0].credits,
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
    if (!isAdmin(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const email = new URL(req.url).searchParams.get('email');

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

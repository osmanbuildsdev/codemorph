import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";
import { getAuthUser, unauthorized } from "@/lib/auth";

// Creates the signed-in user's record on first login and returns it.
export async function POST(req: NextRequest) {
    const authUser = await getAuthUser(req);
    if (!authUser) return unauthorized();

    await db.insert(usersTable).values({
        name: authUser.name,
        email: authUser.email,
        credits: 0,
    }).onConflictDoNothing({ target: usersTable.email });

    const result = await db.select().from(usersTable)
        .where(eq(usersTable.email, authUser.email));

    return NextResponse.json(result[0]);
}

// Returns the signed-in user's record (including credits).
export async function GET(req: NextRequest) {
    const authUser = await getAuthUser(req);
    if (!authUser) return unauthorized();

    const result = await db.select().from(usersTable)
        .where(eq(usersTable.email, authUser.email));

    return NextResponse.json(result[0] ?? null);
}

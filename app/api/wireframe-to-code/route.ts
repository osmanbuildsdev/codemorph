import { db } from "@/configs/db";
import { usersTable, WireframeToCodeTable } from "@/configs/schema";
import { and, desc, eq, gt, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const authUser = await getAuthUser(req);
    if (!authUser) return unauthorized();

    const { description, imageUrl, model, uid } = await req.json();
    if (!uid || !imageUrl || !model) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Spend one credit atomically; no row is updated when the balance is 0
    const charged = await db.update(usersTable)
        .set({ credits: sql`${usersTable.credits} - 1` })
        .where(and(eq(usersTable.email, authUser.email), gt(usersTable.credits, 0)))
        .returning({ id: usersTable.id });

    if (charged.length === 0) {
        return NextResponse.json({ 'error': 'Not enough credits' })
    }

    const result = await db.insert(WireframeToCodeTable).values({
        uid: uid.toString(),
        description: description,
        imageUrl: imageUrl,
        model: model,
        createdBy: authUser.email
    }).returning({ id: WireframeToCodeTable.id });

    return NextResponse.json(result);
}

export async function GET(req: NextRequest) {
    const authUser = await getAuthUser(req);
    if (!authUser) return unauthorized();

    const uid = new URL(req.url).searchParams.get('uid');

    if (uid) {
        const result = await db.select()
            .from(WireframeToCodeTable)
            .where(and(
                eq(WireframeToCodeTable.uid, uid),
                eq(WireframeToCodeTable.createdBy, authUser.email)
            ));
        return result[0]
            ? NextResponse.json(result[0])
            : NextResponse.json({ error: 'No Record Found' }, { status: 404 });
    }

    const result = await db.select()
        .from(WireframeToCodeTable)
        .where(eq(WireframeToCodeTable.createdBy, authUser.email))
        .orderBy(desc(WireframeToCodeTable.id));
    return NextResponse.json(result);
}

export async function PUT(req: NextRequest) {
    const authUser = await getAuthUser(req);
    if (!authUser) return unauthorized();

    const { uid, codeResp } = await req.json();

    const result = await db.update(WireframeToCodeTable)
        .set({
            code: codeResp
        }).where(and(
            eq(WireframeToCodeTable.uid, uid),
            eq(WireframeToCodeTable.createdBy, authUser.email)
        ))
        .returning({ uid: WireframeToCodeTable.uid })

    return NextResponse.json(result);
}

export async function DELETE(req: NextRequest) {
    const authUser = await getAuthUser(req);
    if (!authUser) return unauthorized();

    const uid = new URL(req.url).searchParams.get('uid');
    if (!uid) {
        return NextResponse.json({ error: 'UID parameter is required' }, { status: 400 });
    }

    try {
        const result = await db.delete(WireframeToCodeTable)
            .where(and(
                eq(WireframeToCodeTable.uid, uid),
                eq(WireframeToCodeTable.createdBy, authUser.email)
            ))
            .returning({ uid: WireframeToCodeTable.uid });

        if (result.length === 0) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Design deleted successfully',
            deletedUid: uid
        });
    } catch (error) {
        console.error('Error deleting design:', error);
        return NextResponse.json({ error: 'Failed to delete design' }, { status: 500 });
    }
}

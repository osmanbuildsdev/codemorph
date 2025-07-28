import { NextResponse } from "next/server";
import { adminAuth } from "./firebaseAdmin";

export interface AuthUser {
    uid: string;
    email: string;
    name: string;
}

// Reads the "Authorization: Bearer <Firebase ID token>" header and verifies it.
export async function getAuthUser(req: Request): Promise<AuthUser | null> {
    const match = (req.headers.get("authorization") ?? "").match(/^Bearer (.+)$/);
    if (!match) return null;

    try {
        const decoded = await adminAuth.verifyIdToken(match[1]);
        if (!decoded.email) return null;
        return {
            uid: decoded.uid,
            email: decoded.email,
            name: decoded.name ?? decoded.email,
        };
    } catch {
        return null;
    }
}

export const unauthorized = () =>
    NextResponse.json({ error: "Unauthorized" }, { status: 401 });

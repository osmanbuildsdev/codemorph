import axios from "axios";
import { auth } from "@/configs/firebaseConfig";

// Returns an Authorization header with the signed-in user's Firebase ID token.
export async function authHeader(): Promise<Record<string, string>> {
    const token = await auth.currentUser?.getIdToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Axios instance that attaches the ID token to every request.
export const api = axios.create();

api.interceptors.request.use(async (config) => {
    const headers = await authHeader();
    if (headers.Authorization) config.headers.Authorization = headers.Authorization;
    return config;
});

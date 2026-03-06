// Centralized API client for Spring Boot backend
import { getAuthToken } from './auth-context';

// Direct backend URL — Next.js rewrites strip Authorization headers,
// so authenticated requests must go directly to the Spring Boot server.
const BACKEND_DIRECT = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8083/api';
// Proxy path for unauthenticated requests (login) — avoids CORS issues
const API_PROXY = '/backend';

export interface LoginResponse {
    message: string;
    role: string;
    userId?: string;
    fullName?: string;
    token: string;
    error?: string;
}

export interface UserProfile {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    active: boolean;
    createdAt: string;
    createdBy: string;
}

export interface UserDocument {
    id: string;
    title: string;
    description: string;
    originalFileName: string;
    filePath: string;
    contentType: string;
    fileSize: number;
    category: string;
    uploadedBy: string;
    deleted: boolean;
    version: number;
    createdAt: string;
    updatedAt: string;
}

/**
 * Build auth headers for protected API calls.
 */
function authHeaders(extra?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = { ...extra };
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
    const contentType = res.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
        // Backend returned non-JSON (e.g. HTML error page from Spring Security)
        const text = await res.text();
        throw new Error(
            res.ok
                ? 'Server returned an unexpected response'
                : `Request failed (${res.status}): ${text.substring(0, 100)}`
        );
    }

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
    }
    return data as T;
}

// ===================== Auth (no token needed) =====================

export async function loginUser(userId: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${API_PROXY}/auth/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
    });
    return handleResponse<LoginResponse>(res);
}

export async function loginAdmin(username: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${API_PROXY}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    return handleResponse<LoginResponse>(res);
}

// ===================== User APIs (token required) =====================

export async function getUserProfile(userId: string): Promise<UserProfile> {
    const res = await fetch(`${BACKEND_DIRECT}/user/${userId}/profile`, {
        headers: authHeaders(),
    });
    return handleResponse<UserProfile>(res);
}

export async function getUserDocuments(userId: string): Promise<UserDocument[]> {
    const res = await fetch(`${BACKEND_DIRECT}/user/${userId}/documents`, {
        headers: authHeaders(),
    });
    return handleResponse<UserDocument[]>(res);
}

// ===================== Admin APIs (token required) =====================

export interface CreateUserRequest {
    userId: string;
    password: string;
    fullName?: string;
    email?: string;
    phone?: string;
}

export interface CreateUserResponse {
    message: string;
    userId: string;
    id: string;
    error?: string;
}

export async function createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    const res = await fetch(`${BACKEND_DIRECT}/admin/users`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data),
    });
    return handleResponse<CreateUserResponse>(res);
}

export async function getAllUsers(): Promise<UserProfile[]> {
    const res = await fetch(`${BACKEND_DIRECT}/admin/users`, {
        headers: authHeaders(),
    });
    return handleResponse<UserProfile[]>(res);
}

export async function changeUserPassword(userId: string, newPassword: string): Promise<{ message: string; userId: string }> {
    const res = await fetch(`${BACKEND_DIRECT}/admin/users/${userId}/password`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ newPassword }),
    });
    return handleResponse<{ message: string; userId: string }>(res);
}

export interface UploadDocumentResponse {
    message: string;
    documentId: string;
    fileName: string;
    error?: string;
}

export async function uploadDocument(
    userId: string,
    file: File,
    title: string,
    description?: string,
    category?: string,
): Promise<UploadDocumentResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    if (description) formData.append('description', description);
    if (category) formData.append('category', category);

    const res = await fetch(`${BACKEND_DIRECT}/admin/users/${userId}/documents`, {
        method: 'POST',
        headers: authHeaders(),
        body: formData,
    });
    return handleResponse<UploadDocumentResponse>(res);
}

export async function getAdminDocuments(userId?: string): Promise<UserDocument[]> {
    const params = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    const res = await fetch(`${BACKEND_DIRECT}/admin/documents${params}`, {
        headers: authHeaders(),
    });
    return handleResponse<UserDocument[]>(res);
}

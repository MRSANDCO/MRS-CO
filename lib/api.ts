// Centralized API client for Spring Boot backend
import { getAuthToken } from './auth-context';

// Direct backend URL — Next.js rewrites strip Authorization headers,
// so authenticated requests must go directly to the Spring Boot server.
const BACKEND_DIRECT = process.env.NEXT_PUBLIC_BACKEND_URL;
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

export async function updateUser(userId: string, data: { fullName?: string, email?: string, phone?: string }): Promise<{ message: string; userId: string }> {
    const res = await fetch(`${BACKEND_DIRECT}/admin/users/${userId}`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data),
    });
    return handleResponse<{ message: string; userId: string }>(res);
}

export async function deleteUser(userId: string): Promise<{ message: string; userId: string }> {
    const res = await fetch(`${BACKEND_DIRECT}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: authHeaders(),
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

export async function deleteDocument(documentId: string): Promise<{ message: string; documentId: string }> {
    const res = await fetch(`${BACKEND_DIRECT}/admin/documents/${documentId}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse<{ message: string; documentId: string }>(res);
}

/**
 * Download a document by its ID.
 * Calls GET /api/admin/documents/{documentId}/download with the admin JWT token.
 * Triggers a browser file-save dialog using the Content-Disposition filename or a fallback.
 */
export async function downloadDocument(documentId: string, fallbackFileName = 'document'): Promise<void> {
    const res = await fetch(`${BACKEND_DIRECT}/admin/documents/${documentId}/download`, {
        method: 'GET',
        headers: authHeaders(),
    });

    if (!res.ok) {
        // Try to parse a JSON error body; fall back to status text
        let message = `Download failed (${res.status})`;
        try {
            const err = await res.json();
            message = err.error || err.message || message;
        } catch {
            // non-JSON body — ignore
        }
        throw new Error(message);
    }

    // Derive filename from Content-Disposition header if available
    const disposition = res.headers.get('content-disposition') || '';
    const match = disposition.match(/filename[^;=\n]*=\s*["']?([^"';\n]+)["']?/i);
    const fileName = match?.[1]?.trim() || fallbackFileName;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    // Programmatically click a temporary <a> to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

// ===================== Employee Management Types =====================

export type ProfileStatus = 'INCOMPLETE' | 'SUBMITTED';
export type DocumentVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface EmployeeProfile {
    id?: string;
    employeeId: string;
    name: string;
    fatherName?: string;
    mobileNumber: string;
    fatherMobileNumber?: string;
    aadhaarNumber?: string;
    panNumber?: string;
    dateOfJoining?: string;
    permanentAddress?: string;
    currentAddress?: string;
    resumeGoogleDriveLink?: string;
    aadhaarDocumentUrl?: string;
    aadhaarFileName?: string;
    aadhaarFileSize?: number;
    profileStatus: ProfileStatus;
    documentStatus: DocumentVerificationStatus;
    documentRejectionReason?: string;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdateProfileRequest {
    name?: string;
    fatherName?: string;
    mobileNumber?: string;
    fatherMobileNumber?: string;
    aadhaarNumber?: string;
    panNumber?: string;
    dateOfJoining?: string;
    permanentAddress?: string;
    currentAddress?: string;
    resumeGoogleDriveLink?: string;
}

export interface CreateEmployeeRequest {
    name: string;
    mobileNumber: string;
    initialPassword?: string;
}

export interface CreateEmployeeResponse {
    employeeId: string;
    name: string;
    mobileNumber: string;
    initialPassword?: string;
    profileStatus?: ProfileStatus;
    message: string;
    error?: string;
}

export interface EmployeeLoginResponse {
    message: string;
    role: 'employee';
    employeeId: string;
    name: string;
    profileStatus?: ProfileStatus;
    token: string;
    error?: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

// ===================== Employee Auth =====================

export async function loginEmployee(employeeId: string, password: string): Promise<EmployeeLoginResponse> {
    const res = await fetch(`${API_PROXY}/auth/employee/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, password }),
    });
    return handleResponse<EmployeeLoginResponse>(res);
}

// ===================== Employee Profile APIs (token required) =====================

export async function getEmployeeProfile(): Promise<EmployeeProfile> {
    const res = await fetch(`${BACKEND_DIRECT}/employee/profile`, {
        headers: authHeaders(),
    });
    return handleResponse<EmployeeProfile>(res);
}

export async function updateEmployeeProfile(data: UpdateProfileRequest): Promise<{ message: string; profile: EmployeeProfile }> {
    const res = await fetch(`${BACKEND_DIRECT}/employee/profile`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data),
    });
    return handleResponse<{ message: string; profile: EmployeeProfile }>(res);
}

export async function submitEmployeeProfile(): Promise<{ message: string; profileStatus: string; profile: EmployeeProfile }> {
    const res = await fetch(`${BACKEND_DIRECT}/employee/profile/submit`, {
        method: 'POST',
        headers: authHeaders(),
    });
    return handleResponse<{ message: string; profileStatus: string; profile: EmployeeProfile }>(res);
}

export async function uploadEmployeeDocument(file: File): Promise<{ message: string; fileName: string; documentStatus: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${BACKEND_DIRECT}/employee/profile/document`, {
        method: 'POST',
        headers: authHeaders(),
        body: formData,
    });
    return handleResponse<{ message: string; fileName: string; documentStatus: string }>(res);
}

export async function downloadEmployeeDocument(employeeId?: string, fallbackFileName = 'aadhaar_document.pdf'): Promise<void> {
    const url = employeeId
        ? `${BACKEND_DIRECT}/admin/employees/${encodeURIComponent(employeeId)}/document`
        : `${BACKEND_DIRECT}/employee/profile/document`;

    const res = await fetch(url, {
        method: 'GET',
        headers: authHeaders(),
    });

    if (!res.ok) {
        let message = `Document view/download failed (${res.status})`;
        try {
            const err = await res.json();
            message = err.error || err.message || message;
        } catch {
            // non-json
        }
        throw new Error(message);
    }

    const disposition = res.headers.get('content-disposition') || '';
    const match = disposition.match(/filename[^;=\n]*=\s*["']?([^"';\n]+)["']?/i);
    const fileName = match?.[1]?.trim() || fallbackFileName;

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    // If PDF, open in new browser window/tab for instant preview, with fallback to download
    const win = window.open(blobUrl, '_blank');
    if (!win) {
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
}

// ===================== Admin Employee Management APIs (admin token required) =====================

export async function createAdminEmployee(data: CreateEmployeeRequest): Promise<CreateEmployeeResponse> {
    const res = await fetch(`${BACKEND_DIRECT}/admin/employees`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data),
    });
    return handleResponse<CreateEmployeeResponse>(res);
}

export async function getAdminEmployees(search = '', page = 0, size = 20): Promise<PageResponse<EmployeeProfile>> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', String(page));
    params.append('size', String(size));

    const res = await fetch(`${BACKEND_DIRECT}/admin/employees?${params.toString()}`, {
        headers: authHeaders(),
    });
    return handleResponse<PageResponse<EmployeeProfile>>(res);
}

export async function getAdminEmployeeById(employeeId: string): Promise<EmployeeProfile> {
    const res = await fetch(`${BACKEND_DIRECT}/admin/employees/${encodeURIComponent(employeeId)}`, {
        headers: authHeaders(),
    });
    return handleResponse<EmployeeProfile>(res);
}

export async function updateAdminEmployee(employeeId: string, data: UpdateProfileRequest): Promise<{ message: string; employee: EmployeeProfile }> {
    const res = await fetch(`${BACKEND_DIRECT}/admin/employees/${encodeURIComponent(employeeId)}`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data),
    });
    return handleResponse<{ message: string; employee: EmployeeProfile }>(res);
}

export async function resetEmployeePassword(employeeId: string, newPassword?: string): Promise<{ message: string; employeeId: string; newPassword?: string }> {
    const res = await fetch(`${BACKEND_DIRECT}/admin/employees/${encodeURIComponent(employeeId)}/reset-password`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(newPassword ? { newPassword } : {}),
    });
    return handleResponse<{ message: string; employeeId: string; newPassword?: string }>(res);
}

export async function setEmployeeActiveStatus(employeeId: string, active: boolean): Promise<{ message: string; employeeId: string; active: boolean }> {
    const res = await fetch(`${BACKEND_DIRECT}/admin/employees/${encodeURIComponent(employeeId)}/status`, {
        method: 'PATCH',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ active }),
    });
    return handleResponse<{ message: string; employeeId: string; active: boolean }>(res);
}

export async function verifyEmployeeDocument(employeeId: string): Promise<{ message: string; employeeId: string; documentStatus: string }> {
    const res = await fetch(`${BACKEND_DIRECT}/admin/employees/${encodeURIComponent(employeeId)}/document/verify`, {
        method: 'POST',
        headers: authHeaders(),
    });
    return handleResponse<{ message: string; employeeId: string; documentStatus: string }>(res);
}

export async function rejectEmployeeDocument(employeeId: string, reason?: string): Promise<{ message: string; employeeId: string; documentStatus: string; rejectionReason?: string }> {
    const res = await fetch(`${BACKEND_DIRECT}/admin/employees/${encodeURIComponent(employeeId)}/document/reject`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(reason ? { reason } : {}),
    });
    return handleResponse<{ message: string; employeeId: string; documentStatus: string; rejectionReason?: string }>(res);
}

export async function deleteAdminEmployee(employeeId: string): Promise<{ message: string; employeeId: string }> {
    const res = await fetch(`${BACKEND_DIRECT}/admin/employees/${encodeURIComponent(employeeId)}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse<{ message: string; employeeId: string }>(res);
}


const API_BASE = "/api";

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

// --- 401 token refresh queue ---
let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  refreshQueue = [];
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) throw new Error("no_refresh_token");

  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) throw new Error("refresh_failed");

  const data = await response.json();
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  return data.access_token;
}

function handleLogout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
}

// --- core request ---
async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, ...init } = options;

  let url = `${API_BASE}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const isFormData = init.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(init.headers as Record<string, string>),
  };

  const token = localStorage.getItem("access_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...init, headers });

  // 401 auto-refresh
  if (response.status === 401 && token) {
    if (isRefreshing) {
      // Wait for ongoing refresh
      try {
        const newToken = await new Promise<string>((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        });
        headers["Authorization"] = `Bearer ${newToken}`;
        const retryResponse = await fetch(url, { ...init, headers });
        if (!retryResponse.ok) {
          const error = await retryResponse.json().catch(() => ({}));
          throw new ApiError(retryResponse.status, error.detail ?? "요청에 실패했습니다.");
        }
        if (retryResponse.status === 204) return undefined as T;
        return retryResponse.json();
      } catch {
        handleLogout();
        throw new ApiError(401, "인증이 만료되었습니다.");
      }
    }

    isRefreshing = true;
    try {
      const newToken = await refreshAccessToken();
      processQueue(null, newToken);
      isRefreshing = false;

      // Retry original request
      headers["Authorization"] = `Bearer ${newToken}`;
      const retryResponse = await fetch(url, { ...init, headers });
      if (!retryResponse.ok) {
        const error = await retryResponse.json().catch(() => ({}));
        throw new ApiError(retryResponse.status, error.detail ?? "요청에 실패했습니다.");
      }
      if (retryResponse.status === 204) return undefined as T;
      return retryResponse.json();
    } catch (err) {
      processQueue(err, null);
      isRefreshing = false;
      handleLogout();
      throw new ApiError(401, "인증이 만료되었습니다.");
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(response.status, error.detail ?? "요청에 실패했습니다.");
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

// --- FormData file upload helper ---
export function uploadFiles<T>(
  endpoint: string,
  files: File[],
  fieldName: string = "files",
): Promise<T> {
  const formData = new FormData();
  files.forEach((file) => formData.append(fieldName, file));

  return request<T>(endpoint, {
    method: "POST",
    body: formData,
  });
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const api = {
  get: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "GET" }),
  post: <T>(url: string, body?: unknown, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body?: unknown, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(url: string, body?: unknown, options?: RequestOptions) =>
    request<T>(url, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  delete: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "DELETE" }),
};

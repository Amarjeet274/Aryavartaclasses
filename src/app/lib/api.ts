import { getToken } from './auth';

const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function getHeaders(auth = false) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = await getToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

async function apiRequest<T>(
  method: string,
  path: string,
  body?: unknown,
  auth = false
): Promise<{ data: T | null; error: string | null }> {
  try {
    const headers = await getHeaders(auth);

    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();

    let json;

    try {
      json = JSON.parse(text);
    } catch {
      console.error('Invalid JSON response:', text);

      return {
        data: null,
        error: 'Server returned invalid JSON',
      };
    }

    if (!res.ok) {
      return {
        data: null,
        error: json.error || 'Request failed',
      };
    }

    return {
      data: json.data ?? json,
      error: null,
    };
  } catch (e) {
    console.error(`API error [${method} ${path}]:`, e);

    return {
      data: null,
      error: String(e),
    };
  }
}

// Schools
export const schools = {
  list: () => apiRequest<any[]>('GET', '/schools'),
  create: (body: any) =>
    apiRequest<any>('POST', '/schools', body, true),
  update: (id: string, body: any) =>
    apiRequest<any>('PUT', `/schools/${id}`, body, true),
  delete: (id: string) =>
    apiRequest<any>('DELETE', `/schools/${id}`, undefined, true),
};

// Faculty
export const faculty = {
  list: () => apiRequest<any[]>('GET', '/faculty'),
  create: (body: any) =>
    apiRequest<any>('POST', '/faculty', body, true),
  update: (id: string, body: any) =>
    apiRequest<any>('PUT', `/faculty/${id}`, body, true),
  delete: (id: string) =>
    apiRequest<any>('DELETE', `/faculty/${id}`, undefined, true),
};

// Students
export const students = {
  list: () => apiRequest<any[]>('GET', '/students'),
  create: (body: any) =>
    apiRequest<any>('POST', '/students', body, true),
  update: (id: string, body: any) =>
    apiRequest<any>('PUT', `/students/${id}`, body, true),
  delete: (id: string) =>
    apiRequest<any>('DELETE', `/students/${id}`, undefined, true),
};

// Applications
export const applications = {
  list: () => apiRequest<any[]>('GET', '/applications'),
  create: (body: any) =>
    apiRequest<any>('POST', '/applications', body),
  update: (id: string, body: any) =>
    apiRequest<any>('PATCH', `/applications/${id}`, body, true),
  delete: (id: string) =>
    apiRequest<any>('DELETE', `/applications/${id}`, undefined, true),
};

// Leads
export const leads = {
  list: () => apiRequest<any[]>('GET', '/leads'),
  create: (body: any) =>
    apiRequest<any>('POST', '/leads', body, true),
  update: (id: string, body: any) =>
    apiRequest<any>('PATCH', `/leads/${id}`, body, true),
  delete: (id: string) =>
    apiRequest<any>('DELETE', `/leads/${id}`, undefined, true),
};

// Admin Settings
export const adminSettings = {
  get: () =>
    apiRequest<any>('GET', '/admin-settings', undefined, true),

  update: (body: any) =>
    apiRequest<any>('POST', '/admin-settings', body, true),
};

// Seed
export const seed = () =>
  fetch(`${BASE_URL}/seed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(r => r.json());
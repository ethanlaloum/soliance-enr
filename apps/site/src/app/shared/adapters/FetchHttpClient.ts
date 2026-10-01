import { defer, from, Observable, switchMap } from 'rxjs';
import { ApiError, HttpClient, HttpResponse } from '@/app/shared/domain/ports/HttpClient';

const readHeaders = (headers: Headers): Record<string, string> => {
  const result: Record<string, string> = {};
  headers.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

const readBody = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (text.length === 0) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export class FetchHttpClient implements HttpClient {
  get<T>(url: string): Observable<HttpResponse<T>> {
    return this.request<T>(url, { method: 'GET', headers: { Accept: 'application/json' } });
  }

  post<T, D = void>(url: string, body: T): Observable<HttpResponse<D>> {
    return this.request<D>(url, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  private request<T>(url: string, init: RequestInit): Observable<HttpResponse<T>> {
    return defer(() => from(fetch(url, init))).pipe(
      switchMap(async (response) => {
        const data = await readBody(response);
        const headers = readHeaders(response.headers);
        if (!response.ok) {
          const error: ApiError = { status: response.status, data, headers };
          throw error;
        }
        return { data: data as T, status: response.status, headers };
      }),
    );
  }
}

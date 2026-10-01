import { Observable } from 'rxjs';

export type HttpResponse<T> = {
  data: T;
  status: number;
  headers: Record<string, string>;
};

export interface ApiError {
  status: number;
  data: unknown;
  headers: Record<string, string>;
}

export const isApiError = (error: unknown): error is ApiError =>
  typeof error === 'object' && error !== null && 'status' in error && typeof (error as { status: unknown }).status === 'number';

export interface HttpClient {
  get<T>(url: string): Observable<HttpResponse<T>>;
  post<T, D = void>(url: string, body: T): Observable<HttpResponse<D>>;
}

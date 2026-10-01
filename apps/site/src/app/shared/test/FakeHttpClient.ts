import { Observable, of, throwError } from 'rxjs';
import { ApiError, HttpClient, HttpResponse } from '@/app/shared/domain/ports/HttpClient';

export class FakeHttpClient implements HttpClient {
  public readonly getCalls: string[] = [];
  public readonly postCalls: { url: string; body: unknown }[] = [];
  private readonly responses = new Map<string, unknown>();
  private readonly failures = new Map<string, ApiError>();

  willRespond<T>(url: string, data: T): void {
    this.responses.set(url, data);
  }

  willFail(url: string, status: number, data: unknown = {}): void {
    this.failures.set(url, { status, data, headers: {} });
  }

  get<T>(url: string): Observable<HttpResponse<T>> {
    this.getCalls.push(url);
    return this.answer<T>(url);
  }

  post<T, D = void>(url: string, body: T): Observable<HttpResponse<D>> {
    this.postCalls.push({ url, body });
    return this.answer<D>(url);
  }

  private answer<T>(url: string): Observable<HttpResponse<T>> {
    const failure = this.failures.get(url);
    if (failure) return throwError(() => failure);
    return of({ data: this.responses.get(url) as T, status: 200, headers: {} });
  }
}

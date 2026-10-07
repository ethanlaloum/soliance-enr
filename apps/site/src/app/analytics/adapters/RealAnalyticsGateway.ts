import { defer, Observable, of } from 'rxjs';
import { AnalyticsEvent } from '@/app/analytics/domain/entities/AnalyticsEvent';
import { AnalyticsGateway } from '@/app/analytics/domain/ports/AnalyticsGateway';

type GoogleTagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  [disableFlag: `ga-disable-${string}`]: boolean;
};

const googleTagWindow = () => window as unknown as GoogleTagWindow;

const thirteenMonthsInSeconds = 13 * 30 * 24 * 60 * 60;

const analyticsCookiePattern = /^_ga(_.+)?$/;

const cookieDomainsOf = (hostname: string): string[] => {
  const labels = hostname.split('.');
  const domains = labels.slice(0, -1).map((_label, index) => `.${labels.slice(index).join('.')}`);
  return ['', ...domains];
};

const expireAnalyticsCookies = () => {
  const names = document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0].trim())
    .filter((name) => analyticsCookiePattern.test(name));

  names.forEach((name) => {
    cookieDomainsOf(window.location.hostname).forEach((domain) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ''}`;
    });
  });
};

export class GoogleTagAnalyticsGateway implements AnalyticsGateway {
  private enabled = false;

  constructor(private readonly measurementId: string | null) {}

  enable(): Observable<void> {
    return defer(() => {
      const measurementId = this.measurementId;
      if (!measurementId || typeof window === 'undefined') return of(undefined);

      const target = googleTagWindow();
      target[`ga-disable-${measurementId}`] = false;
      if (!target.gtag) {
        const dataLayer = (target.dataLayer = target.dataLayer ?? []);
        target.gtag = function gtag() {
          // eslint-disable-next-line prefer-rest-params
          dataLayer.push(arguments);
        };
        target.gtag('js', new Date());
        target.gtag('config', measurementId, { cookie_expires: thirteenMonthsInSeconds, cookie_update: false });
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
        document.head.appendChild(script);
      }
      this.enabled = true;
      return of(undefined);
    });
  }

  disable(): Observable<void> {
    return defer(() => {
      this.enabled = false;
      if (typeof window === 'undefined') return of(undefined);
      if (this.measurementId) googleTagWindow()[`ga-disable-${this.measurementId}`] = true;
      expireAnalyticsCookies();
      return of(undefined);
    });
  }

  track(event: AnalyticsEvent): Observable<void> {
    return defer(() => {
      const gtag = typeof window === 'undefined' ? undefined : googleTagWindow().gtag;
      if (this.enabled && gtag) gtag('event', event.name, event.params);
      return of(undefined);
    });
  }
}

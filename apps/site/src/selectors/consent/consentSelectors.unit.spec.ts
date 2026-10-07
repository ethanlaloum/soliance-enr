import { describe, expect, it } from 'vitest';
import { AppState } from '@/store/AppState';
import { ConsentState, initialConsentState } from '@/app/consent/store/ConsentSlice';
import { ConsentStatus } from '@/app/consent/domain/entities/ConsentChoice';
import {
  selectAnalyticsConsentGranted,
  selectConsentBannerVisible,
  selectConsentEditionOpen,
  selectConsentStatus,
} from '@/selectors/consent/consentSelectors';

const stateWith = (consent: Partial<ConsentState>): AppState =>
  ({ core: { consent: { consent: { ...initialConsentState, ...consent } } } }) as AppState;

const acceptance = { analytics: true, decidedAt: '2026-10-07T09:20:00.000Z', version: 1 };
const refusal = { analytics: false, decidedAt: '2026-10-07T09:15:00.000Z', version: 1 };

const consentView = (state: AppState) => ({
  bannerVisible: selectConsentBannerVisible(state),
  editionOpen: selectConsentEditionOpen(state),
  status: selectConsentStatus(state),
  analyticsGranted: selectAnalyticsConsentGranted(state),
});

describe('Consent selectors', () => {
  it('shows nothing before the stored choice is read', () => {
    expect(consentView(stateWith({ loadConsent: { state: 'pending' } }))).toEqual({
      bannerVisible: false,
      editionOpen: false,
      status: null,
      analyticsGranted: false,
    });
  });

  it('shows the banner to a visitor who has not decided yet', () => {
    expect(consentView(stateWith({ loadConsent: { state: 'succeeded' } }))).toEqual({
      bannerVisible: true,
      editionOpen: false,
      status: ConsentStatus.UNDECIDED,
      analyticsGranted: false,
    });
  });

  it('shows the banner when the stored choice could not be read', () => {
    expect(consentView(stateWith({ loadConsent: { state: 'failed', errorCode: 'STORAGE_UNAVAILABLE' } }))).toEqual({
      bannerVisible: true,
      editionOpen: false,
      status: ConsentStatus.UNDECIDED,
      analyticsGranted: false,
    });
  });

  it('hides the banner and grants analytics once the visitor accepted', () => {
    expect(consentView(stateWith({ loadConsent: { state: 'succeeded' }, choice: acceptance }))).toEqual({
      bannerVisible: false,
      editionOpen: false,
      status: ConsentStatus.ANALYTICS_GRANTED,
      analyticsGranted: true,
    });
  });

  it('hides the banner and refuses analytics once the visitor refused', () => {
    expect(consentView(stateWith({ loadConsent: { state: 'succeeded' }, choice: refusal }))).toEqual({
      bannerVisible: false,
      editionOpen: false,
      status: ConsentStatus.ANALYTICS_REFUSED,
      analyticsGranted: false,
    });
  });

  it('replaces the banner by the preferences while they are open', () => {
    expect(consentView(stateWith({ loadConsent: { state: 'succeeded' }, isEditing: true }))).toEqual({
      bannerVisible: false,
      editionOpen: true,
      status: ConsentStatus.UNDECIDED,
      analyticsGranted: false,
    });
  });
});

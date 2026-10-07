import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/redux';
import { loadConsentRequested } from '@/app/consent/domain/use-cases/load-consent/loadConsentEpic';
import { saveConsentRequested } from '@/app/consent/domain/use-cases/save-consent/saveConsentEpic';
import { consentEditionClosed, consentEditionOpened } from '@/app/consent/domain/use-cases/edit-consent/editConsent';
import {
  selectAnalyticsConsentGranted,
  selectConsentBannerVisible,
  selectConsentEditionOpen,
  selectConsentLoadIdle,
  selectConsentSaving,
  selectConsentStatus,
} from '@/selectors/consent/consentSelectors';

export const useCookieConsent = () => {
  const dispatch = useAppDispatch();
  const isLoadIdle = useAppSelector(selectConsentLoadIdle);
  const isBannerVisible = useAppSelector(selectConsentBannerVisible);
  const isEditionOpen = useAppSelector(selectConsentEditionOpen);
  const isAnalyticsGranted = useAppSelector(selectAnalyticsConsentGranted);
  const isSaving = useAppSelector(selectConsentSaving);
  const status = useAppSelector(selectConsentStatus);

  const load = useCallback(() => dispatch(loadConsentRequested()), [dispatch]);
  const decide = useCallback((analytics: boolean) => dispatch(saveConsentRequested({ analytics })), [dispatch]);
  const openEdition = useCallback(() => dispatch(consentEditionOpened()), [dispatch]);
  const closeEdition = useCallback(() => dispatch(consentEditionClosed()), [dispatch]);

  return { isLoadIdle, isBannerVisible, isEditionOpen, isAnalyticsGranted, isSaving, status, load, decide, openEdition, closeEdition };
};

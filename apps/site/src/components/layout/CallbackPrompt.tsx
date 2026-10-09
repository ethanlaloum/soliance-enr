import { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { cn } from '@/lib/utils';
import { config } from '@/config';
import { contactAnchor, paths } from '@/routes/paths';
import { isCallbackPromptAllowedOn } from '@/app/callback-prompt/domain/entities/CallbackPrompt';
import { useCallbackPrompt } from '@/hooks/useCallbackPrompt';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { CloseIcon, PhoneIcon } from '@/components/icons/Icons';
import { ContactLink } from '@/components/contact/ContactLink';
import { ContactFormKind } from '@/components/contact/contactDialog';

const titleId = 'callback-prompt-title';

export const CallbackPrompt = () => {
  const { t } = useTranslation('common');
  const { pathname } = useLocation();
  const { isBannerVisible, isEditionOpen } = useCookieConsent();
  const { isOpen, dismiss } = useCallbackPrompt(isCallbackPromptAllowedOn(pathname) && !isBannerVisible && !isEditionOpen);

  if (!isOpen) return null;

  const closeOnEscape = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') dismiss();
  };

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      onKeyDown={closeOnEscape}
      className="fixed inset-x-4 bottom-4 z-40 flex flex-col gap-3.5 rounded-2xl bg-night p-5 font-sans text-white shadow-lift motion-safe:animate-fade-up sm:inset-x-auto sm:right-6 sm:max-w-[380px] lg:bottom-6 lg:p-6"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label={t('callbackPrompt.close')}
        className="absolute right-2.5 top-2.5 flex h-11 w-11 items-center justify-center rounded-full text-slate-light transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-solar motion-reduce:transition-none"
      >
        <CloseIcon className="h-5 w-5" />
      </button>
      <div className="flex flex-col gap-1.5 pr-9">
        <p id={titleId} className="text-lg font-bold leading-snug lg:text-xl">
          {t('callbackPrompt.title')}
        </p>
        <p className="text-sm leading-normal text-slate-light">{t('callbackPrompt.text')}</p>
      </div>
      <div className="flex flex-col gap-2.5">
        <a href={config.salesPhoneHref} onClick={dismiss} className={cn(buttonVariants({ size: 'sm' }), 'gap-2')}>
          <PhoneIcon className="h-[18px] w-[18px]" />
          {t('callbackPrompt.call', { phone: t('header.phoneDisplay') })}
        </a>
        <ContactLink
          kind={ContactFormKind.STUDY}
          href={`${paths.home}#${contactAnchor}`}
          onClick={dismiss}
          className={cn(buttonVariants({ variant: 'outlineLight', size: 'sm' }), 'whitespace-normal text-center')}
        >
          {t('callbackPrompt.appointment')}
        </ContactLink>
      </div>
    </aside>
  );
};

import { lazy, ReactNode, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormDialog } from '@/components/ui/FormDialog';
import { ContactDialogContext, contactDialogIdPrefixes, ContactFormKind, loadContactForm } from '@/components/contact/contactDialog';

const forms = {
  [ContactFormKind.STUDY]: lazy(loadContactForm[ContactFormKind.STUDY]),
  [ContactFormKind.PROFESSIONAL]: lazy(loadContactForm[ContactFormKind.PROFESSIONAL]),
  [ContactFormKind.REFERRAL]: lazy(loadContactForm[ContactFormKind.REFERRAL]),
};

const titleSuffixes: Record<ContactFormKind, string> = {
  [ContactFormKind.STUDY]: 'request-title',
  [ContactFormKind.PROFESSIONAL]: 'title',
  [ContactFormKind.REFERRAL]: 'form-title',
};

export const ContactDialogProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation('common');
  const [kind, setKind] = useState<ContactFormKind | null>(null);

  const open = useCallback((next: ContactFormKind) => setKind(next), []);
  const controls = useMemo(() => ({ open }), [open]);

  useEffect(() => {
    const preloadStudyForm = () => void loadContactForm[ContactFormKind.STUDY]();
    if (typeof window.requestIdleCallback === 'function') {
      const handle = window.requestIdleCallback(preloadStudyForm, { timeout: 5000 });
      return () => window.cancelIdleCallback(handle);
    }
    const timer = setTimeout(preloadStudyForm, 3000);
    return () => clearTimeout(timer);
  }, []);
  const Form = kind ? forms[kind] : null;

  return (
    <ContactDialogContext.Provider value={controls}>
      {children}
      {kind && Form && (
        <FormDialog
          labelledBy={`${contactDialogIdPrefixes[kind]}-${titleSuffixes[kind]}`}
          closeLabel={t('contactDialog.close')}
          tone={kind === ContactFormKind.PROFESSIONAL ? 'dark' : 'light'}
          onClose={() => setKind(null)}
        >
          <Suspense fallback={<div className="min-h-[420px] rounded-[20px] bg-white" />}>
            <Form idPrefix={contactDialogIdPrefixes[kind]} />
          </Suspense>
        </FormDialog>
      )}
    </ContactDialogContext.Provider>
  );
};

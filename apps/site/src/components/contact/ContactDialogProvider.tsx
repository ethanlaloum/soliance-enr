import { ComponentType, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormDialog } from '@/components/ui/FormDialog';
import { ContactDialogContext, contactDialogIdPrefixes, ContactFormKind, loadContactForm } from '@/components/contact/contactDialog';

type OpenDialog = {
  kind: ContactFormKind;
  Form: ComponentType<{ idPrefix: string }>;
};

const titleSuffixes: Record<ContactFormKind, string> = {
  [ContactFormKind.STUDY]: 'request-title',
  [ContactFormKind.PROFESSIONAL]: 'title',
  [ContactFormKind.REFERRAL]: 'form-title',
  [ContactFormKind.PORTFOLIO]: 'form-title',
};

export const ContactDialogProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation('common');
  const [dialog, setDialog] = useState<OpenDialog | null>(null);
  const requested = useRef<ContactFormKind | null>(null);

  const preload = useCallback((next: ContactFormKind) => void loadContactForm[next](), []);
  const open = useCallback((next: ContactFormKind) => {
    requested.current = next;
    void loadContactForm[next]().then(({ default: Form }) => {
      if (requested.current === next) setDialog({ kind: next, Form });
    });
  }, []);
  const close = useCallback(() => {
    requested.current = null;
    setDialog(null);
  }, []);
  const controls = useMemo(() => ({ open, preload }), [open, preload]);

  useEffect(() => {
    const preloadStudyForm = () => void loadContactForm[ContactFormKind.STUDY]();
    if (typeof window.requestIdleCallback === 'function') {
      const handle = window.requestIdleCallback(preloadStudyForm, { timeout: 5000 });
      return () => window.cancelIdleCallback(handle);
    }
    const timer = setTimeout(preloadStudyForm, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ContactDialogContext.Provider value={controls}>
      {children}
      {dialog && (
        <FormDialog
          labelledBy={`${contactDialogIdPrefixes[dialog.kind]}-${titleSuffixes[dialog.kind]}`}
          closeLabel={t('contactDialog.close')}
          tone={dialog.kind === ContactFormKind.PROFESSIONAL ? 'dark' : 'light'}
          onClose={close}
        >
          <dialog.Form idPrefix={contactDialogIdPrefixes[dialog.kind]} />
        </FormDialog>
      )}
    </ContactDialogContext.Provider>
  );
};

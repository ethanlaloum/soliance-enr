import { ReactNode } from 'react';
import { ContactFormKind, useContactDialog } from '@/components/contact/contactDialog';

type ContactLinkProps = {
  kind: ContactFormKind;
  href: string;
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
};

export const ContactLink = ({ kind, href, className, onClick, children }: ContactLinkProps) => {
  const dialog = useContactDialog();

  return (
    <a
      href={href}
      aria-haspopup={dialog ? 'dialog' : undefined}
      className={className}
      onPointerEnter={() => dialog?.preload(kind)}
      onFocus={() => dialog?.preload(kind)}
      onClick={(event) => {
        onClick?.();
        if (!dialog) return;
        event.preventDefault();
        dialog.open(kind);
      }}
    >
      {children}
    </a>
  );
};

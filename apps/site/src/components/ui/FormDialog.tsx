import { MouseEvent, ReactNode, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { CloseIcon } from '@/components/icons/Icons';

type FormDialogProps = {
  labelledBy: string;
  closeLabel: string;
  tone?: 'light' | 'dark';
  onClose: () => void;
  children: ReactNode;
};

const closeButtonClassNames = {
  light: 'text-slate-ink hover:bg-ivory hover:text-night focus-visible:outline-solar',
  dark: 'text-slate-light hover:bg-white/10 hover:text-white focus-visible:outline-solar',
};

export const FormDialog = ({ labelledBy, closeLabel, tone = 'light', onClose, children }: FormDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    if (dialog && !dialog.open) dialog.showModal();
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previousOverflow;
      dialog?.close();
    };
  }, []);

  const closeOnBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={closeOnBackdrop}
      className="max-h-[calc(100dvh-24px)] w-[calc(100%-24px)] max-w-[600px] overflow-y-auto overscroll-contain rounded-[20px] bg-transparent p-0 font-sans backdrop:bg-night/70 motion-safe:animate-fade-up motion-safe:[animation-duration:250ms]"
    >
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className={cn(
            'absolute right-2.5 top-2.5 z-10 flex h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 motion-reduce:transition-none lg:right-4 lg:top-4',
            closeButtonClassNames[tone],
          )}
        >
          <CloseIcon />
        </button>
        {children}
      </div>
    </dialog>
  );
};

import { ReactNode, useContext } from 'react';
import { careAnchors } from '@/components/care/careAnchors';
import { CareRequestContext } from '@/components/care/careRequestContext';
import { CareRequestType } from '@/components/care/careRequestSchema';

type CareRequestLinkProps = {
  requestType: CareRequestType;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
};

export const CareRequestLink = ({ requestType, className, onClick, children }: CareRequestLinkProps) => {
  const chooseRequest = useContext(CareRequestContext);

  return (
    <a
      href={`#${careAnchors.request}`}
      className={className}
      aria-haspopup="dialog"
      onClick={(event) => {
        event.preventDefault();
        chooseRequest(requestType);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
};

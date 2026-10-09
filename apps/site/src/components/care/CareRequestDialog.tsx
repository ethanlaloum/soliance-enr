import { useTranslation } from 'react-i18next';
import { CareRequestType } from '@/components/care/careRequestSchema';
import { CareRequestForm } from '@/components/care/CareRequestForm';
import { FormDialog } from '@/components/ui/FormDialog';

const idPrefix = 'dialog-care-request';

type CareRequestDialogProps = {
  requestType: CareRequestType;
  onRequestTypeChange: (requestType: CareRequestType) => void;
  onClose: () => void;
};

export const CareRequestDialog = ({ requestType, onRequestTypeChange, onClose }: CareRequestDialogProps) => {
  const { t } = useTranslation('care');

  return (
    <FormDialog labelledBy={`${idPrefix}-form-title`} closeLabel={t('form.close')} onClose={onClose}>
      <CareRequestForm idPrefix={idPrefix} requestType={requestType} onRequestTypeChange={onRequestTypeChange} />
    </FormDialog>
  );
};

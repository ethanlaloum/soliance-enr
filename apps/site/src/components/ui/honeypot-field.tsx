import { Ref } from 'react';
import { useTranslation } from 'react-i18next';

export const HoneypotField = ({ ref }: { ref: Ref<HTMLInputElement> }) => {
  const { t } = useTranslation('common');

  return (
    <div aria-hidden="true" className="sr-only">
      <label>
        {t('form.honeypotLabel')}
        <input ref={ref} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
};

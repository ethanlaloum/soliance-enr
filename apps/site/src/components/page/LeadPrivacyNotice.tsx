import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';

type LeadPrivacyNoticeProps = {
  tone?: 'light' | 'dark';
  lead?: string;
};

export const LeadPrivacyNotice = ({ tone = 'light', lead }: LeadPrivacyNoticeProps) => {
  const { t } = useTranslation('common');

  return (
    <p className={cn('ml-[30px] text-xs leading-[1.5]', tone === 'dark' ? 'text-slate-light' : 'text-slate-ink')}>
      {lead && <>{lead} </>}
      {t('leadForm.privacyNotice')}{' '}
      <Link to={paths.privacy} className={cn('font-semibold text-solar', tone === 'dark' ? 'hover:text-white' : 'hover:text-solar-dark')}>
        {t('leadForm.privacyLink')}
      </Link>
    </p>
  );
};

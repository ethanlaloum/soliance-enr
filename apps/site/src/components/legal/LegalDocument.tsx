import { Fragment, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Breadcrumb } from '@/components/page/Breadcrumb';
import { containerClassName } from '@/components/home/containerClassName';

type LegalTable = { caption: string; head: string[]; rows: string[][] };

type LegalBlock = { p: string } | { ul: string[] } | { table: LegalTable };

type LegalSection = { title: string; blocks: LegalBlock[] };

export type LegalDocumentKey = 'legalNotice' | 'privacy';

const emailPattern = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

const sectionTitleClassName = 'text-[22px] font-bold tracking-[-0.01em] lg:text-[28px]';
const paragraphClassName = 'text-base leading-[1.6] text-slate-text';
const linkClassName = 'font-semibold text-solar hover:text-solar-dark';

const withEmailLinks = (text: string): ReactNode[] =>
  text.split(emailPattern).map((part, index) =>
    index % 2 === 1 ? (
      <a key={index} href={`mailto:${part}`} className={linkClassName}>
        {part}
      </a>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );

const LegalBlockView = ({ block }: { block: LegalBlock }) => {
  if ('p' in block) return <p className={paragraphClassName}>{withEmailLinks(block.p)}</p>;
  if ('ul' in block) {
    return (
      <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-solar">
        {block.ul.map((item) => (
          <li key={item} className={paragraphClassName}>
            {withEmailLinks(item)}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-sand-line bg-white">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <caption className="sr-only">{block.table.caption}</caption>
        <thead className="bg-ivory text-night">
          <tr>
            {block.table.head.map((column) => (
              <th key={column} scope="col" className="px-4 py-3 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.table.rows.map(([purpose, ...cells]) => (
            <tr key={purpose} className="border-t border-sand-line align-top">
              <th scope="row" className="px-4 py-3 font-medium text-night">
                {purpose}
              </th>
              {cells.map((cell) => (
                <td key={cell} className="px-4 py-3 text-slate-text">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const LegalDocument = ({ documentKey }: { documentKey: LegalDocumentKey }) => {
  const { t, i18n } = useTranslation('legal');
  const sections = t(`${documentKey}.sections`, { returnObjects: true }) as LegalSection[];
  const hasIntro = i18n.exists(`legal:${documentKey}.intro`);

  return (
    <div className={cn(containerClassName, 'flex max-w-[960px] flex-col gap-10 pb-16 pt-8 lg:gap-12 lg:pb-[100px] lg:pt-16')}>
      <section aria-labelledby={`${documentKey}-title`} className="flex flex-col gap-3 lg:gap-4">
        <Breadcrumb items={[{ label: t(`${documentKey}.breadcrumb`) }]} tone="light" className="motion-safe:animate-fade-up" />
        <h1
          id={`${documentKey}-title`}
          className="text-[34px] font-bold leading-[1.1] tracking-[-0.02em] motion-safe:animate-fade-up motion-safe:[animation-delay:80ms] lg:text-[52px]"
        >
          {t(`${documentKey}.title`)}
        </h1>
        <p className="text-sm text-slate">{t(`${documentKey}.updatedAt`)}</p>
        {hasIntro && <p className="text-base leading-normal text-slate-ink lg:text-lg lg:leading-[1.55]">{t(`${documentKey}.intro`)}</p>}
      </section>

      {sections.map((section, index) => (
        <section key={section.title} aria-labelledby={`${documentKey}-section-${index}`} className="flex flex-col gap-3">
          <h2 id={`${documentKey}-section-${index}`} className={sectionTitleClassName}>
            {section.title}
          </h2>
          {section.blocks.map((block, blockIndex) => (
            <LegalBlockView key={blockIndex} block={block} />
          ))}
        </section>
      ))}
    </div>
  );
};

import { cn } from '@/lib/utils';

export type FaqItem = { question: string; answer: string };

type FaqListProps = {
  items: FaqItem[];
  accentClassName?: string;
  className?: string;
};

export const FaqList = ({ items, accentClassName = 'text-solar', className }: FaqListProps) => (
  <div className={cn('flex flex-col divide-y divide-sand-line rounded-2xl border border-sand-line bg-white', className)}>
    {items.map((item) => (
      <details key={item.question} data-faq-item className="group px-5 py-4 lg:px-7 lg:py-5">
        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-bold marker:hidden lg:text-lg [&::-webkit-details-marker]:hidden">
          <span data-faq-question>{item.question}</span>
          <span
            aria-hidden="true"
            className={cn('mt-0.5 text-2xl leading-none transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none', accentClassName)}
          >
            +
          </span>
        </summary>
        <p data-faq-answer className="pt-3 text-[15px] leading-[1.6] text-slate-ink lg:text-base">
          {item.answer}
        </p>
      </details>
    ))}
  </div>
);

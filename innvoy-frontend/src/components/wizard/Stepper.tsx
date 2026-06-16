import { cn } from '@/lib/utils';
import { useLang } from '@/i18n/context';

interface Props {
  current: 1 | 2;
}

export function Stepper({ current }: Props) {
  const { t } = useLang();
  const steps = [
    { n: 1, label: t.step1Label },
    { n: 2, label: t.step2Label },
  ] as const;

  return (
    <div className="mb-6 flex items-center">
      {steps.map((step, i) => (
        <div key={step.n} className="flex items-center">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                step.n <= current
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border text-muted-foreground',
              )}
            >
              {step.n}
            </span>
            <span
              className={cn(
                'text-sm font-medium',
                step.n <= current ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn('mx-3 h-px w-10', step.n < current ? 'bg-primary' : 'bg-border')} />
          )}
        </div>
      ))}
    </div>
  );
}

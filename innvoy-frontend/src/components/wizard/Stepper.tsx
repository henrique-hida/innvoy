import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useLang } from '@/i18n/context';

interface Props {
  current: 1 | 2;
}

interface StepDef {
  n: number;
  label: string;
}

function StepBadge({ step, active }: { step: StepDef; active: boolean }) {
  return (
    <motion.span
      animate={{
        backgroundColor: active ? 'var(--color-primary)' : 'transparent',
        color: active ? 'var(--color-primary-foreground)' : 'var(--color-muted-foreground)',
      }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium',
        !active && 'border border-border',
      )}
    >
      {step.n}
    </motion.span>
  );
}

function StepConnector({ filled }: { filled: boolean }) {
  return (
    <motion.div
      animate={{
        backgroundColor: filled ? 'var(--color-primary)' : 'var(--color-border)',
      }}
      transition={{ duration: 0.3 }}
      className="mx-3 h-px w-10"
    />
  );
}

export function Stepper({ current }: Props) {
  const { t } = useLang();
  const steps: StepDef[] = [
    { n: 1, label: t.step1Label },
    { n: 2, label: t.step2Label },
  ];

  return (
    <div className="mb-6 flex items-center">
      {steps.map((step, i) => (
        <div key={step.n} className="flex items-center">
          <div className="flex items-center gap-2">
            <StepBadge step={step} active={step.n <= current} />
            <span
              className={cn(
                'text-sm font-medium transition-colors duration-300',
                step.n <= current ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && <StepConnector filled={step.n < current} />}
        </div>
      ))}
    </div>
  );
}

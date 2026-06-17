import { motion } from 'motion/react';
import { useLang } from '@/i18n/context';

interface Props {
  current: 1 | 2;
}

const spring = { type: 'spring', stiffness: 300, damping: 24, mass: 0.8 } as const;

function StepBadge({ n, active }: { n: number; active: boolean }) {
  return (
    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
      <motion.div
        className="absolute inset-0 rounded-full bg-primary"
        initial={false}
        animate={{ scale: active ? 1 : 0 }}
        transition={spring}
      />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-border"
        initial={false}
        animate={{ scale: active ? 0 : 1, opacity: active ? 0 : 1 }}
        transition={spring}
      />
      <motion.span
        className="relative z-10 text-xs font-semibold"
        initial={false}
        animate={{
          color: active ? 'var(--color-primary-foreground)' : 'var(--color-muted-foreground)',
        }}
        transition={{ duration: 0.2 }}
      >
        {n}
      </motion.span>
    </div>
  );
}

function StepConnector({ filled }: { filled: boolean }) {
  return (
    <div className="mx-3 h-[2px] w-12 overflow-hidden rounded-full bg-border">
      <motion.div
        className="h-full rounded-full bg-primary"
        initial={false}
        animate={{ width: filled ? '100%' : '0%' }}
        transition={{ ...spring, stiffness: 200, damping: 20 }}
      />
    </div>
  );
}

export function Stepper({ current }: Props) {
  const { t } = useLang();
  const steps = [
    { n: 1, label: t.step1Label },
    { n: 2, label: t.step2Label },
  ];

  return (
    <div className="mb-6 flex items-center">
      {steps.map((step, i) => (
        <div key={step.n} className="flex items-center">
          <div className="flex items-center gap-2">
            <StepBadge n={step.n} active={step.n <= current} />
            <motion.span
              className="text-sm font-medium"
              initial={false}
              animate={{
                color:
                  step.n <= current ? 'var(--color-foreground)' : 'var(--color-muted-foreground)',
              }}
              transition={{ duration: 0.25 }}
            >
              {step.label}
            </motion.span>
          </div>
          {i < steps.length - 1 && <StepConnector filled={step.n < current} />}
        </div>
      ))}
    </div>
  );
}

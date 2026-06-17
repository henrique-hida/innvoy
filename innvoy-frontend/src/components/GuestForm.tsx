import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Guest } from '../types/guest';
import { toFormState, toGuest, type FormState, STEP1_KEYS, STEP2_KEYS } from './wizard/formState';
import { useLang } from '@/i18n/context';
import type { Translations } from '@/i18n/translations';
import { validateFirstError } from '@/lib/validation';
import Step1 from './wizard/Step1';
import Step2 from './wizard/Step2';

type FieldErrors = Record<string, string>;

function hasErrors(errs: FieldErrors): boolean {
  return Object.values(errs).some(Boolean);
}

const STEP1_FIELDS = new Set<string>(STEP1_KEYS);

interface BackendError {
  field: keyof FormState;
  translationKey: keyof Translations;
}

const BACKEND_ERRORS: { pattern: string; error: BackendError }[] = [
  { pattern: 'cpf already', error: { field: 'cpf', translationKey: 'cpfAlreadyRegistered' } },
  { pattern: 'invalid cpf', error: { field: 'cpf', translationKey: 'invalidCpf' } },
  { pattern: 'invalid email', error: { field: 'email', translationKey: 'invalidEmailFormat' } },
  { pattern: "'fullname'", error: { field: 'fullName', translationKey: 'requiredField' } },
  { pattern: "'phone'", error: { field: 'phone', translationKey: 'requiredField' } },
  { pattern: "'dateofbirth'", error: { field: 'dateOfBirth', translationKey: 'requiredField' } },
  { pattern: "'email'", error: { field: 'email', translationKey: 'requiredField' } },
  { pattern: "'cpf'", error: { field: 'cpf', translationKey: 'requiredField' } },
];

function detectBackendError(message: string): BackendError | null {
  const lower = message.toLowerCase();
  const match = BACKEND_ERRORS.find((e) => lower.includes(e.pattern));
  return match ? match.error : null;
}

interface Props {
  initial?: Guest;
  onSubmit: (guest: Guest) => Promise<void>;
  onDeactivate?: () => Promise<void>;
  submitLabel: string;
}

export default function GuestForm({ initial, onSubmit, onDeactivate, submitLabel }: Props) {
  const { t } = useLang();
  const [form, setForm] = useState<FormState>(() => toFormState(initial));
  const [step, setStep] = useState<1 | 2>(1);
  const [step1Errors, setStep1Errors] = useState<FieldErrors>({});
  const [step2Errors, setStep2Errors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  const handleNext = () => {
    const errs = validateFirstError(form, STEP1_KEYS, t);
    setStep1Errors(errs);
    if (hasErrors(errs)) return;
    setStep(2);
  };

  const handleBackendError = (message: string) => {
    const detected = detectBackendError(message);
    if (!detected) {
      setSubmitError(message);
      return;
    }
    const translated = t[detected.translationKey];
    if (STEP1_FIELDS.has(detected.field)) {
      setStep1Errors({ [detected.field]: translated });
      setStep2Errors({});
      setStep(1);
    } else {
      setStep2Errors({ [detected.field]: translated });
    }
  };

  const handleSubmit = () => {
    const errs = validateFirstError(form, STEP2_KEYS, t);
    setStep2Errors(errs);
    if (hasErrors(errs)) return;
    setSubmitting(true);
    setSubmitError('');
    onSubmit(toGuest(form, initial))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : t.unexpectedError;
        handleBackendError(message);
      })
      .finally(() => setSubmitting(false));
  };

  const handleDeactivate = async () => {
    if (!onDeactivate || !window.confirm(t.deactivateConfirm)) return;
    setDeactivating(true);
    try {
      await onDeactivate();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t.unexpectedError);
      setDeactivating(false);
    }
  };

  const isActive = initial ? initial.active : true;
  const deactivateProp = onDeactivate ? handleDeactivate : undefined;

  return (
    <form className="mx-auto max-w-xl" onSubmit={(e) => e.preventDefault()}>
      <AnimatePresence>
        {submitError && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm text-destructive"
          >
            {submitError}
          </motion.p>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait" initial={false}>
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            <Step1
              fields={form}
              errors={step1Errors}
              isEditing={!!initial}
              onChange={(f) => setForm((prev) => ({ ...prev, ...f }))}
              onNext={handleNext}
            />
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.25 }}
          >
            <Step2
              fields={form}
              errors={step2Errors}
              onChange={(f) => setForm((prev) => ({ ...prev, ...f }))}
              onBack={() => setStep(1)}
              onSubmit={handleSubmit}
              onDeactivate={deactivateProp}
              submitLabel={submitLabel}
              submitting={submitting}
              deactivating={deactivating}
              isActive={isActive}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

import { useState } from 'react';
import type { Guest } from '../types/guest';
import { toFormState, toGuest, type FormState, STEP1_KEYS, STEP2_KEYS } from './wizard/formState';
import { useLang } from '@/i18n/context';
import { validateFirstError } from '@/lib/validation';
import Step1 from './wizard/Step1';
import Step2 from './wizard/Step2';

type FieldErrors = Record<string, string>;

function hasErrors(errs: FieldErrors): boolean {
  return Object.values(errs).some(Boolean);
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

  const handleSubmit = () => {
    const errs = validateFirstError(form, STEP2_KEYS, t);
    setStep2Errors(errs);
    if (hasErrors(errs)) return;
    setSubmitting(true);
    setSubmitError('');
    onSubmit(toGuest(form, initial))
      .catch((err: unknown) => {
        setSubmitError(err instanceof Error ? err.message : t.unexpectedError);
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
      {submitError && (
        <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm text-destructive">
          {submitError}
        </p>
      )}
      {step === 1 ? (
        <Step1
          fields={form}
          errors={step1Errors}
          isEditing={!!initial}
          onChange={(f) => setForm((prev) => ({ ...prev, ...f }))}
          onNext={handleNext}
        />
      ) : (
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
      )}
    </form>
  );
}

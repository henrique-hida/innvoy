import type { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormField } from './FormField';
import { Stepper } from './Stepper';
import { maskCPF, maskPhone, maskDate } from '@/lib/masks';
import { useLang } from '@/i18n/context';
import type { PersonalFields } from './formState';

type FieldErrors = Record<string, string>;

interface Props {
  fields: PersonalFields;
  errors: FieldErrors;
  isEditing: boolean;
  onChange: (fields: PersonalFields) => void;
  onNext: () => void;
}

function withMask(key: keyof PersonalFields, val: string): string {
  if (key === 'cpf') return maskCPF(val);
  if (key === 'phone') return maskPhone(val);
  if (key === 'dateOfBirth') return maskDate(val);
  return val;
}

export default function Step1({ fields, errors, isEditing, onChange, onNext }: Props) {
  const { t } = useLang();

  const handle = (key: keyof PersonalFields) => (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...fields, [key]: withMask(key, e.target.value) });

  return (
    <>
      <Stepper current={1} />

      <fieldset className="mb-5 rounded-xl border p-5">
        <legend className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t.personalInfoLegend}
        </legend>

        <div className="flex flex-col gap-4">
          <FormField id="fullName" label={t.fullNameField} error={errors.fullName}>
            <Input
              id="fullName"
              value={fields.fullName}
              onChange={handle('fullName')}
            />
          </FormField>

          <FormField id="cpf" label={t.cpfField} error={errors.cpf}>
            <Input
              id="cpf"
              value={fields.cpf}
              onChange={handle('cpf')}
              readOnly={isEditing}
              className={isEditing ? 'cursor-not-allowed bg-muted' : ''}
            />
          </FormField>

          <FormField id="dateOfBirth" label={t.dateOfBirthField} error={errors.dateOfBirth}>
            <Input
              id="dateOfBirth"
              value={fields.dateOfBirth}
              onChange={handle('dateOfBirth')}
              inputMode="numeric"
            />
          </FormField>

          <FormField id="phone" label={t.phoneField} error={errors.phone}>
            <Input
              id="phone"
              value={fields.phone}
              onChange={handle('phone')}
              inputMode="numeric"
            />
          </FormField>

          <FormField id="email" label={t.emailField} error={errors.email}>
            <Input
              id="email"
              type="email"
              value={fields.email}
              onChange={handle('email')}
            />
          </FormField>
        </div>
      </fieldset>

      <div className="flex justify-end">
        <Button type="button" size="lg" className="px-6" onClick={onNext}>
          {t.nextStep}
        </Button>
      </div>
    </>
  );
}

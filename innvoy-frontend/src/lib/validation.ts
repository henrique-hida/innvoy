import type { Translations } from '@/i18n/translations';
import type { FormState } from '@/components/wizard/formState';

function digits(value: string): string {
  return value.replace(/\D/g, '');
}

function allSameDigit(d: string): boolean {
  return /^(\d)\1{10}$/.test(d);
}

function cpfCheckDigit(d: string, length: number): number {
  let sum = 0;
  for (let i = 0; i < length; i++) sum += Number(d[i]) * (length + 1 - i);
  const remainder = (sum * 10) % 11;
  return remainder === 10 ? 0 : remainder;
}

function isValidCpfDigits(cpf: string): boolean {
  const d = digits(cpf);
  if (d.length !== 11 || allSameDigit(d)) return false;
  return cpfCheckDigit(d, 9) === Number(d[9]) && cpfCheckDigit(d, 10) === Number(d[10]);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseDateParts(display: string): { day: number; month: number; year: number } | null {
  const d = digits(display);
  if (d.length !== 8) return null;
  return { day: Number(d.slice(0, 2)), month: Number(d.slice(2, 4)), year: Number(d.slice(4, 8)) };
}

function isInRange(parts: { day: number; month: number }): boolean {
  return parts.month >= 1 && parts.month <= 12 && parts.day >= 1;
}

function matchesConstructed(parts: { day: number; month: number; year: number }): boolean {
  const date = new Date(parts.year, parts.month - 1, parts.day);
  return (
    date.getFullYear() === parts.year &&
    date.getMonth() === parts.month - 1 &&
    date.getDate() === parts.day
  );
}

function isValidDate(display: string): boolean {
  const parts = parseDateParts(display);
  if (!parts) return false;
  return isInRange(parts) && matchesConstructed(parts);
}

function isFutureDate(display: string): boolean {
  const parts = parseDateParts(display);
  if (!parts) return false;
  return new Date(parts.year, parts.month - 1, parts.day) > new Date();
}

type Validator = (value: string, t: Translations) => string | null;

const fieldValidators: Partial<Record<keyof FormState, Validator>> = {
  fullName: (v, t) => (v.trim().split(/\s+/).length < 2 ? t.fullNameTooShort : null),
  cpf: (v, t) => (isValidCpfDigits(v) ? null : t.invalidCpf),
  dateOfBirth: (v, t) => {
    if (!isValidDate(v)) return t.invalidDate;
    return isFutureDate(v) ? t.futureDateOfBirth : null;
  },
  phone: (v, t) => {
    const len = digits(v).length;
    return len >= 10 && len <= 11 ? null : t.invalidPhone;
  },
  email: (v, t) => (isValidEmail(v) ? null : t.invalidEmail),
  zipCode: (v, t) => (digits(v).length === 8 ? null : t.invalidZipCode),
};

function validateField(field: keyof FormState, value: string, t: Translations): string | null {
  if (!value || value.trim() === '') return t.requiredField;
  const validator = fieldValidators[field];
  return validator ? validator(value, t) : null;
}

export function validateFirstError(
  form: FormState,
  keys: readonly (keyof FormState)[],
  t: Translations,
): Record<string, string> {
  for (const key of keys) {
    const error = validateField(key, form[key], t);
    if (error) return { [key]: error };
  }
  return {};
}

import type { Guest, Address } from '../../types/guest';
import { isoToDisplay, displayToIso } from '../../lib/masks';

export interface FormState {
  fullName: string;
  cpf: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  zipCode: string;
  street: string;
  addressNumber: string;
  neighborhood: string;
  complement: string;
  citySearch: string;
  cityName: string;
  stateAbbreviation: string;
  stateName: string;
}

export type PersonalFields = Pick<
  FormState,
  'fullName' | 'cpf' | 'dateOfBirth' | 'phone' | 'email'
>;

export type AddressFields = Omit<FormState, 'fullName' | 'cpf' | 'dateOfBirth' | 'phone' | 'email'>;

const EMPTY: FormState = {
  fullName: '',
  cpf: '',
  dateOfBirth: '',
  phone: '',
  email: '',
  zipCode: '',
  street: '',
  addressNumber: '',
  neighborhood: '',
  complement: '',
  citySearch: '',
  cityName: '',
  stateAbbreviation: '',
  stateName: '',
};

function personalFromGuest(g: Guest): PersonalFields {
  return {
    fullName: g.fullName,
    cpf: g.cpf,
    dateOfBirth: isoToDisplay(g.dateOfBirth.split('T')[0]),
    phone: g.phone,
    email: g.email,
  };
}

function addressFromGuest(a: Address): AddressFields {
  const { city } = a;
  return {
    zipCode: a.zipCode,
    street: a.street,
    addressNumber: a.number,
    neighborhood: a.neighborhood,
    complement: a.complement,
    citySearch: `${city.name} (${city.state.abbreviation})`,
    cityName: city.name,
    stateAbbreviation: city.state.abbreviation,
    stateName: city.state.name,
  };
}

export function toFormState(guest?: Guest): FormState {
  if (!guest) return EMPTY;
  return { ...personalFromGuest(guest), ...addressFromGuest(guest.address) };
}

function buildAddress(form: FormState, existing?: Guest): Address {
  const existingAddr = existing ? existing.address : undefined;
  return {
    id: existingAddr ? existingAddr.id : undefined,
    street: form.street,
    number: form.addressNumber,
    zipCode: form.zipCode,
    neighborhood: form.neighborhood,
    complement: form.complement,
    city: {
      name: form.cityName,
      state: { name: form.stateName, abbreviation: form.stateAbbreviation },
    },
  };
}

export const STEP1_KEYS: (keyof FormState)[] = ['fullName', 'cpf', 'dateOfBirth', 'phone', 'email'];

export const STEP2_KEYS: (keyof FormState)[] = [
  'zipCode',
  'street',
  'addressNumber',
  'neighborhood',
  'complement',
  'citySearch',
];

export function toGuest(form: FormState, existing?: Guest): Guest {
  const guest: Guest = {
    fullName: form.fullName,
    cpf: form.cpf,
    dateOfBirth: displayToIso(form.dateOfBirth),
    phone: form.phone,
    email: form.email,
    active: existing ? existing.active : true,
    address: buildAddress(form, existing),
  };
  if (existing) guest.id = existing.id;
  return guest;
}

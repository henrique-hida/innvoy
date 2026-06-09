export interface State {
  name: string;
  abbreviation: string;
}

export interface City {
  name: string;
  state: State;
}

export interface Address {
  id?: number;
  street: string;
  number: string;
  zipCode: string;
  neighborhood: string;
  complement: string;
  city: City;
}

export interface Guest {
  id?: number;
  fullName: string;
  cpf: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  active: boolean;
  address: Address;
}

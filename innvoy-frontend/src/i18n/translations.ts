export type Lang = 'en' | 'pt';

const en = {
  // common
  backToGuests: '← Back to guests',
  requiredField: 'Required field',
  unexpectedError: 'Unexpected error',
  invalidCpf: 'Invalid CPF',
  invalidEmail: 'Invalid email',
  invalidPhone: 'Phone must have 10 or 11 digits',
  invalidDate: 'Invalid date',
  futureDateOfBirth: 'Date of birth cannot be in the future',
  invalidZipCode: 'ZIP code must have 8 digits',
  fullNameTooShort: 'Enter first and last name',

  // status
  all: 'All',
  active: 'Active',
  inactive: 'Inactive',

  // guest list
  searchPlaceholder: 'Search by name, CPF, phone or email…',
  statusLabel: 'Status',
  guests: 'Guests',
  newGuest: 'New guest',
  statusFilter: 'Status:',
  fullName: 'Full name',
  cpf: 'CPF',
  email: 'Email',
  phone: 'Phone',
  status: 'Status',
  edit: 'Edit',
  loading: 'Loading…',
  noGuests: 'No guests found.',

  // pages
  newGuestTitle: 'New guest',
  editGuestTitle: 'Edit guest',
  createGuest: 'Create guest',
  saveChanges: 'Save changes',

  // form
  deactivateConfirm: 'Deactivate this guest? This cannot be undone.',

  // wizard
  step1Label: 'Personal info',
  step2Label: 'Address',
  personalInfoLegend: 'Personal information',
  addressLegend: 'Address',

  // step 1 fields
  fullNameField: 'Full name',
  cpfField: 'CPF',
  dateOfBirthField: 'Date of birth',
  phoneField: 'Phone',
  emailField: 'Email',
  nextStep: 'Next',

  // step 2 fields
  zipCodeField: 'ZIP code',
  zipCodeLooking: 'ZIP code (looking up…)',
  streetField: 'Street',
  numberField: 'Number',
  complementField: 'Complement',
  neighborhoodField: 'Neighborhood',
  cityField: 'City',
  cityLoading: 'City (loading…)',
  backStep: '← Back',
  deactivateGuest: 'Deactivate guest',
  deactivating: 'Deactivating…',
  saving: 'Saving…',
};

const pt: typeof en = {
  backToGuests: '← Voltar para hóspedes',
  requiredField: 'Campo obrigatório',
  unexpectedError: 'Erro inesperado',
  invalidCpf: 'CPF inválido',
  invalidEmail: 'E-mail inválido',
  invalidPhone: 'Telefone deve ter 10 ou 11 dígitos',
  invalidDate: 'Data inválida',
  futureDateOfBirth: 'Data de nascimento não pode ser no futuro',
  invalidZipCode: 'CEP deve ter 8 dígitos',
  fullNameTooShort: 'Informe nome e sobrenome',

  all: 'Todos',
  active: 'Ativo',
  inactive: 'Inativo',

  searchPlaceholder: 'Buscar por nome, CPF, telefone ou e-mail…',
  statusLabel: 'Status',
  guests: 'Hóspedes',
  newGuest: 'Novo hóspede',
  statusFilter: 'Status:',
  fullName: 'Nome completo',
  cpf: 'CPF',
  email: 'E-mail',
  phone: 'Telefone',
  status: 'Status',
  edit: 'Editar',
  loading: 'Carregando…',
  noGuests: 'Nenhum hóspede encontrado.',

  newGuestTitle: 'Novo hóspede',
  editGuestTitle: 'Editar hóspede',
  createGuest: 'Cadastrar hóspede',
  saveChanges: 'Salvar alterações',

  deactivateConfirm: 'Desativar este hóspede? Esta ação não pode ser desfeita.',

  step1Label: 'Dados pessoais',
  step2Label: 'Endereço',
  personalInfoLegend: 'Dados pessoais',
  addressLegend: 'Endereço',

  fullNameField: 'Nome completo',
  cpfField: 'CPF',
  dateOfBirthField: 'Data de nascimento',
  phoneField: 'Telefone',
  emailField: 'E-mail',
  nextStep: 'Próximo',

  zipCodeField: 'CEP',
  zipCodeLooking: 'CEP (buscando…)',
  streetField: 'Logradouro',
  numberField: 'Número',
  complementField: 'Complemento',
  neighborhoodField: 'Bairro',
  cityField: 'Cidade',
  cityLoading: 'Cidade (carregando…)',
  backStep: '← Voltar',
  deactivateGuest: 'Desativar hóspede',
  deactivating: 'Desativando…',
  saving: 'Salvando…',
};

export const translations = { en, pt };
export type Translations = typeof en;

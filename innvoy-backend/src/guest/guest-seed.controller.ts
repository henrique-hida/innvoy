import { Controller, Delete, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from './domain/guest';
import { Address } from './domain/address';

const MOCK_GUESTS = [
  {
    fullName: 'Ana Clara Souza',
    cpf: '52998224725',
    dob: '1990-03-15',
    phone: '11999887766',
    email: 'ana.souza@email.com',
    zip: '01310-100',
    street: 'Av. Paulista',
    num: '1000',
    nb: 'Bela Vista',
    comp: 'Apto 101',
    city: 'São Paulo',
    st: 'São Paulo',
    uf: 'SP',
  },
  {
    fullName: 'Bruno Costa Lima',
    cpf: '78945612300',
    dob: '1985-07-22',
    phone: '21988776655',
    email: 'bruno.lima@email.com',
    zip: '20040-020',
    street: 'Av. Rio Branco',
    num: '156',
    nb: 'Centro',
    comp: 'Sala 301',
    city: 'Rio de Janeiro',
    st: 'Rio de Janeiro',
    uf: 'RJ',
  },
  {
    fullName: 'Carla Mendes Oliveira',
    cpf: '32165498700',
    dob: '1992-11-08',
    phone: '31977665544',
    email: 'carla.oliveira@email.com',
    zip: '30130-000',
    street: 'Av. Afonso Pena',
    num: '2500',
    nb: 'Funcionários',
    comp: 'Bloco B',
    city: 'Belo Horizonte',
    st: 'Minas Gerais',
    uf: 'MG',
  },
  {
    fullName: 'Daniel Ferreira Santos',
    cpf: '45678912301',
    dob: '1988-01-30',
    phone: '41966554433',
    email: 'daniel.santos@email.com',
    zip: '80010-000',
    street: 'R. XV de Novembro',
    num: '700',
    nb: 'Centro',
    comp: 'Loja 5',
    city: 'Curitiba',
    st: 'Paraná',
    uf: 'PR',
  },
  {
    fullName: 'Elena Rodrigues Pinto',
    cpf: '98765432100',
    dob: '1995-06-12',
    phone: '51955443322',
    email: 'elena.pinto@email.com',
    zip: '90010-000',
    street: 'R. dos Andradas',
    num: '1234',
    nb: 'Centro Histórico',
    comp: 'Cobertura',
    city: 'Porto Alegre',
    st: 'Rio Grande do Sul',
    uf: 'RS',
  },
  {
    fullName: 'Felipe Almeida Castro',
    cpf: '11223344556',
    dob: '1993-09-25',
    phone: '71944332211',
    email: 'felipe.castro@email.com',
    zip: '40020-000',
    street: 'R. Chile',
    num: '35',
    nb: 'Comércio',
    comp: 'Andar 2',
    city: 'Salvador',
    st: 'Bahia',
    uf: 'BA',
  },
  {
    fullName: 'Gabriela Nunes Pereira',
    cpf: '66778899001',
    dob: '1991-04-17',
    phone: '61933221100',
    email: 'gabi.pereira@email.com',
    zip: '70040-010',
    street: 'SBS Quadra 2',
    num: '12',
    nb: 'Asa Sul',
    comp: 'Bloco E',
    city: 'Brasília',
    st: 'Distrito Federal',
    uf: 'DF',
  },
  {
    fullName: 'Henrique Moura Silva',
    cpf: '99887766554',
    dob: '1987-12-03',
    phone: '81922110099',
    email: 'henrique.silva@email.com',
    zip: '50010-000',
    street: 'Av. Guararapes',
    num: '250',
    nb: 'Santo Antônio',
    comp: 'Sala 10',
    city: 'Recife',
    st: 'Pernambuco',
    uf: 'PE',
  },
  {
    fullName: 'Isabela Teixeira Ramos',
    cpf: '44556677889',
    dob: '1996-02-28',
    phone: '85911009988',
    email: 'isa.ramos@email.com',
    zip: '60060-000',
    street: 'R. Barão do Rio Branco',
    num: '1500',
    nb: 'Centro',
    comp: 'Casa',
    city: 'Fortaleza',
    st: 'Ceará',
    uf: 'CE',
  },
  {
    fullName: 'João Pedro Barbosa',
    cpf: '22334455667',
    dob: '1989-08-14',
    phone: '92900998877',
    email: 'jp.barbosa@email.com',
    zip: '69010-000',
    street: 'Av. Eduardo Ribeiro',
    num: '520',
    nb: 'Centro',
    comp: 'Apto 45',
    city: 'Manaus',
    st: 'Amazonas',
    uf: 'AM',
  },
  {
    fullName: 'Karen Lopes Vieira',
    cpf: '55667788990',
    dob: '1994-10-06',
    phone: '48899887766',
    email: 'karen.vieira@email.com',
    zip: '88010-000',
    street: 'R. Conselheiro Mafra',
    num: '82',
    nb: 'Centro',
    comp: 'Apto 202',
    city: 'Florianópolis',
    st: 'Santa Catarina',
    uf: 'SC',
  },
  {
    fullName: 'Lucas Martins Rocha',
    cpf: '33445566778',
    dob: '1986-05-19',
    phone: '62888776655',
    email: 'lucas.rocha@email.com',
    zip: '74010-000',
    street: 'Av. Goiás',
    num: '1200',
    nb: 'Centro',
    comp: 'Sala 8',
    city: 'Goiânia',
    st: 'Goiás',
    uf: 'GO',
  },
  {
    fullName: 'Marina Cardoso Dias',
    cpf: '77889900112',
    dob: '1997-01-11',
    phone: '27877665544',
    email: 'marina.dias@email.com',
    zip: '29010-000',
    street: 'Av. Jerônimo Monteiro',
    num: '300',
    nb: 'Centro',
    comp: 'Andar 3',
    city: 'Vitória',
    st: 'Espírito Santo',
    uf: 'ES',
  },
  {
    fullName: 'Nicolas Araújo Gomes',
    cpf: '88990011223',
    dob: '1990-07-07',
    phone: '91866554433',
    email: 'nicolas.gomes@email.com',
    zip: '66010-000',
    street: 'Av. Presidente Vargas',
    num: '499',
    nb: 'Campina',
    comp: 'Bloco A',
    city: 'Belém',
    st: 'Pará',
    uf: 'PA',
  },
  {
    fullName: 'Olivia Ribeiro Campos',
    cpf: '00112233445',
    dob: '1998-03-23',
    phone: '65855443322',
    email: 'olivia.campos@email.com',
    zip: '78005-000',
    street: 'Av. Isaac Póvoas',
    num: '880',
    nb: 'Centro Norte',
    comp: 'Casa 2',
    city: 'Cuiabá',
    st: 'Mato Grosso',
    uf: 'MT',
  },
];

function buildGuest(m: (typeof MOCK_GUESTS)[number]): Guest {
  const guest = new Guest();
  guest.fullName = m.fullName;
  guest.cpf = m.cpf;
  guest.dateOfBirth = new Date(m.dob);
  guest.phone = m.phone;
  guest.email = m.email;
  guest.active = true;

  const address = new Address();
  address.street = m.street;
  address.number = m.num;
  address.zipCode = m.zip;
  address.neighborhood = m.nb;
  address.complement = m.comp;
  address.city = { name: m.city, state: { name: m.st, abbreviation: m.uf } };
  guest.address = address;

  return guest;
}

@Controller('guests/seed')
export class GuestSeedController {
  constructor(
    @InjectRepository(Guest)
    private readonly guestRepo: Repository<Guest>,
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
  ) {}

  @Post()
  async seed(): Promise<{ count: number }> {
    await this.clear();
    const guests = MOCK_GUESTS.map(buildGuest);
    await this.guestRepo.save(guests);
    return { count: guests.length };
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async clear(): Promise<void> {
    await this.addressRepo.delete({});
    await this.guestRepo.delete({});
  }
}

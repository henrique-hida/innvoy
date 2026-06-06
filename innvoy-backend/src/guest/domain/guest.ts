import { Column, Entity, OneToOne } from 'typeorm';
import { Address } from './address';
import { DomainEntity } from './domain-entity';

@Entity('guests')
export class Guest extends DomainEntity {
  @Column()
  fullName!: string;

  @Column({ unique: true })
  cpf!: string;

  @Column({ type: 'date' })
  dateOfBirth!: Date;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  @OneToOne(() => Address, (address) => address.guest, {
    cascade: true,
    eager: true,
  })
  address!: Address;
}

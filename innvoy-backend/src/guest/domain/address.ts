import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from './city';
import { Guest } from './guest';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  street!: string;

  @Column()
  number!: string;

  @Column({ name: 'zip_code' })
  zipCode!: string;

  @Column()
  neighborhood!: string;

  @Column()
  complement!: string;

  @Column(() => City)
  city!: City;

  @OneToOne(() => Guest, (guest) => guest.address)
  @JoinColumn({ name: 'guest_id' })
  guest?: Guest;
}

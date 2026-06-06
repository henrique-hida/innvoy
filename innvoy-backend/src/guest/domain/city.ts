import { Column } from 'typeorm';
import { State } from './state';

export class City {
  @Column()
  name!: string;

  @Column(() => State)
  state!: State;
}

import { Column } from 'typeorm';

export class State {
  @Column()
  name!: string;

  @Column()
  abbreviation!: string;
}

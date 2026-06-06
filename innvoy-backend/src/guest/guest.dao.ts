import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Guest } from './domain/guest';

@Injectable()
export class GuestDAO {
  constructor(
    @InjectRepository(Guest)
    private readonly repo: Repository<Guest>,
  ) {}

  async save(guest: Guest): Promise<Guest> {
    return this.repo.save(guest);
  }

  async update(guest: Guest): Promise<Guest> {
    return this.repo.save(guest);
  }

  async deactivate(id: number): Promise<void> {
    await this.repo.update(id, { active: false });
  }

  async findAll(filters: Partial<Guest>): Promise<Guest[]> {
    return this.repo.find({ where: filters as FindOptionsWhere<Guest> });
  }

  async findByCPF(cpf: string): Promise<Guest | null> {
    return this.repo.findOneBy({ cpf });
  }
}

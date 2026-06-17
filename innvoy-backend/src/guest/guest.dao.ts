import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Guest } from './domain/guest';
import { IDAO } from '../core/idao';

const TEXT_FIELDS: (keyof Guest)[] = ['fullName', 'cpf', 'phone', 'email'];

function toSearchValue(key: string, value: unknown): unknown {
  const k = key as keyof Guest;
  if (TEXT_FIELDS.includes(k)) {
    return ILike(`%${value as string}%`);
  }
  return value;
}

function buildWhere(filters: Partial<Guest>): FindOptionsWhere<Guest> {
  const where: FindOptionsWhere<Guest> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null) continue;
    (where as Record<string, unknown>)[key] = toSearchValue(key, value);
  }
  return where;
}

@Injectable()
export class GuestDAO implements IDAO {
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
    return this.repo.find({ where: buildWhere(filters) });
  }

  async findByCPF(cpf: string): Promise<Guest | null> {
    return this.repo.findOneBy({ cpf });
  }

  async findByEmail(email: string): Promise<Guest | null> {
    return this.repo.findOneBy({ email });
  }
}

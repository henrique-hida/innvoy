import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Facade } from '../core/facade';
import { Guest } from './domain/guest';

@Controller('guests')
export class GuestController {
  constructor(private readonly facade: Facade) {}

  @Post()
  async create(@Body() body: Guest): Promise<Guest> {
    const guest = Object.assign(new Guest(), body);
    const result = await this.facade.create(guest);
    return result as Guest;
  }

  @Put()
  async update(@Body() body: Guest): Promise<Guest> {
    const guest = Object.assign(new Guest(), body);
    const result = await this.facade.update(guest);
    return result as Guest;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deactivate(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const guest = new Guest();
    guest.id = id;
    return this.facade.deactivate(guest);
  }

  @Get()
  async findAll(@Query() filters: Partial<Guest>): Promise<Guest[]> {
    if (filters.active !== undefined) {
      filters.active = String(filters.active) === 'true';
    }
    const guest = Object.assign(new Guest(), filters);
    const results = await this.facade.findAll(guest);
    return results as Guest[];
  }
}

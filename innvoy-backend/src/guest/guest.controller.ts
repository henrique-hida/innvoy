import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { GuestFacade } from './guest.facade';
import { Guest } from './domain/guest';

@Controller('guests')
export class GuestController {
  constructor(private readonly facade: GuestFacade) {}

  @Post()
  async create(@Body() guest: Guest): Promise<Guest> {
    return this.facade.create(guest);
  }

  @Put()
  async update(@Body() guest: Guest): Promise<Guest> {
    return this.facade.update(guest);
  }

  @Delete(':id')
  async deactivate(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.facade.deactivate(id);
  }

  @Get()
  async findAll(@Query() filters: Partial<Guest>): Promise<Guest[]> {
    if (filters.active !== undefined) {
      filters.active = String(filters.active) === 'true';
    }
    return this.facade.findAll(filters);
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestController } from './guest.controller';
import { GuestSeedController } from './guest-seed.controller';
import { GuestFacade } from './guest.facade';
import { GuestDAO } from './guest.dao';
import { ValidateRequiredFieldsStrategy } from './strategies/validate-required-fields.strategy';
import { ValidateCPFStrategy } from './strategies/validate-cpf.strategy';
import { ValidateEmailStrategy } from './strategies/validate-email.strategy';
import { Guest } from './domain/guest';
import { Address } from './domain/address';

@Module({
  imports: [TypeOrmModule.forFeature([Guest, Address])],
  controllers: [GuestSeedController, GuestController],
  providers: [
    GuestFacade,
    GuestDAO,
    ValidateRequiredFieldsStrategy,
    ValidateCPFStrategy,
    ValidateEmailStrategy,
  ],
})
export class GuestModule {}

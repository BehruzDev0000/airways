import { Module } from '@nestjs/common';
import { CarRentalsService } from './car-rentals.service';
import { CarRentalsController } from './car-rentals.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CarRental } from './entities/car-rental.entity';
import { User } from 'src/users/entities/user.entity';
import { Car } from 'src/cars/entities/car.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [SequelizeModule.forFeature([CarRental,User,Car]), AuthModule, TransactionsModule],
  controllers: [CarRentalsController],
  providers: [CarRentalsService],
  exports: [CarRentalsService]
})
export class CarRentalsModule {}

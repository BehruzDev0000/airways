import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Car } from './entities/car.entity';
import { Company } from 'src/companies/entities/company.entity';
import { City } from 'src/cities/entities/city.entity';
import { CarRental } from 'src/car-rentals/entities/car-rental.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Car,Company,City,CarRental]), AuthModule],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService]
})
export class CarsModule {}
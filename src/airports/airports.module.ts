import { Module } from '@nestjs/common';
import { AirportsService } from './airports.service';
import { AirportsController } from './airports.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Airport } from './entities/airport.entity';
import { City } from 'src/cities/entities/city.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Airport,City]), AuthModule],
  controllers: [AirportsController],
  providers: [AirportsService],
  exports: [AirportsService]
})
export class AirportsModule {}
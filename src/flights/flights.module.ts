import { Module } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Plane } from 'src/planes/entities/plane.entity';
import { Airport } from 'src/airports/entities/airport.entity';
import { Flight } from './entities/flight.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[SequelizeModule.forFeature([Plane,Airport,Flight]),AuthModule],
  controllers: [FlightsController],
  providers: [FlightsService],
  exports:[FlightsService]
})
export class FlightsModule {}

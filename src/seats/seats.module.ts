import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { Seat } from './entities/seat.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { Flight } from 'src/flights/entities/flight.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Plane } from 'src/planes/entities/plane.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[SequelizeModule.forFeature([Seat,Flight,Class,Plane,Ticket]),AuthModule],
  controllers: [SeatsController],
  providers: [SeatsService],
  exports:[SeatsService]
})
export class SeatsModule {}

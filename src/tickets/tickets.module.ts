import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Flight } from 'src/flights/entities/flight.entity';
import { User } from 'src/users/entities/user.entity';
import { Ticket } from './entities/ticket.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { Class } from 'src/classes/entities/class.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { Plane } from 'src/planes/entities/plane.entity';

@Module({
  imports:[SequelizeModule.forFeature([Flight,User,Ticket,Seat,Class,Plane]),AuthModule, TransactionsModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}

import { Module } from '@nestjs/common';
import { HotelBookingsService } from './hotel-bookings.service';
import { HotelBookingsController } from './hotel-bookings.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { HotelBooking } from './entities/hotel-booking.entity';
import { User } from 'src/users/entities/user.entity';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports:[SequelizeModule.forFeature([HotelBooking,User,Hotel]),AuthModule, TransactionsModule],
  controllers: [HotelBookingsController],
  providers: [HotelBookingsService],
})
export class HotelBookingsModule {}

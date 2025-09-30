import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHotelBookingDto } from './dto/create-hotel-booking.dto';
import { UpdateHotelBookingDto } from './dto/update-hotel-booking.dto';
import { handleError } from 'src/utils/handle-error';
import { InjectModel } from '@nestjs/sequelize';
import { HotelBooking } from './entities/hotel-booking.entity';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { User } from 'src/users/entities/user.entity';
import { successResponse } from 'src/utils/success.response';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class HotelBookingsService {
  constructor(
    @InjectModel(HotelBooking) private readonly hoteBookingModel:typeof HotelBooking,
    @InjectModel(Hotel) private readonly hotelModel:typeof Hotel,
    @InjectModel(User) private readonly userModel:typeof User,
    private readonly transactionsService: TransactionsService,
  ){}
  async create(createHotelBookingDto: CreateHotelBookingDto) {
    try {
      const user=await this.userModel.findOne({where:{id:createHotelBookingDto.userId}})
      if(!user){
        throw new NotFoundException('user not found')
      }
      const hotel=await this.hotelModel.findOne({where:{id:createHotelBookingDto.hotelId}})
      if(!hotel){
        throw new NotFoundException('Hotel not found')
      }
      const userBalance = Number(user.balance) || 0;
      const price = Number(createHotelBookingDto.price) || 0;
      if (price <= 0) throw new BadRequestException('Invalid booking price');
      if (userBalance < price) throw new BadRequestException('Not enough balance');
      await user.update({ balance: userBalance - price });
      const hotelBooking=await this.hoteBookingModel.create({...createHotelBookingDto})
      await this.transactionsService.recordTransaction({
        userId: user.id,
        amount: price,
        type: 'hotel',
        description: `Hotel booking #${hotelBooking.id}`,
      });
      return successResponse(hotelBooking)
    } catch (error) {
      handleError(error)
    }
  }

  async findAll() {
    try {
      const hotelBookings=await this.hoteBookingModel.findAll({include:{all:true}})
      return successResponse(hotelBookings)
    } catch (error) {
      handleError(error)
    }
  }

  async findOne(id: number) {
   try {
    const hotelBooking=await this.hoteBookingModel.findOne({where:{id},include:{all:true}})
    if(!hotelBooking){
      throw new NotFoundException('Hotel Booking not found')
    }
    return successResponse(hotelBooking)
   } catch (error) {
    handleError(error)
   }
  }

  async update(id: number, updateHotelBookingDto: UpdateHotelBookingDto) {
   try {
    const user=await this.userModel.findOne({where:{id:updateHotelBookingDto.userId}})
      if(!user){
        throw new NotFoundException('user not found')
      }
      const hotel=await this.hotelModel.findOne({where:{id:updateHotelBookingDto.hotelId}})
      if(!hotel){
        throw new NotFoundException('Hotel not found')
      }
      const hotelBooking=await this.hoteBookingModel.findOne({where:{id}})
      if(!hotelBooking){
        throw new NotFoundException('Hotel Booking not found')
      }
      const updatedHotelBooking=await this.hoteBookingModel.update(updateHotelBookingDto,{where:{id},returning:true})  
      return successResponse(updatedHotelBooking[1][0])
    } catch (error) {
    handleError(error)
   }
  }

  async remove(id: number) {
    try {
      const hotelBooking=await this.hoteBookingModel.findOne({where:{id}})
      if(!hotelBooking){
        throw new NotFoundException('Hotel Booking not found')
      }
      const affected = await this.hoteBookingModel.destroy({where:{id}})
      return successResponse({message:'Hotel booking deleted', affected})
    } catch (error) {
      handleError(error)
    }
  }
}



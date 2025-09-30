import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { handleError } from 'src/utils/handle-error';
import { InjectModel } from '@nestjs/sequelize';
import { Hotel } from './entities/hotel.entity';
import { User } from 'src/users/entities/user.entity';
import { successResponse } from 'src/utils/success.response';

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(Hotel) private readonly hotelModel:typeof Hotel,
    @InjectModel(User) private readonly userModel:typeof User
  ){}
  async create(createHotelDto: CreateHotelDto) {
    try {
      const user=await this.userModel.findOne({where:{id:createHotelDto.userId}})
      if(!user){
        throw new NotFoundException('User not found')
      }
      const hotel=await this.hotelModel.create({...createHotelDto})
      return successResponse(hotel)
    } catch (error) {
      handleError(error)
    }
  }

  async findAll() {
    try {
      const hotels=await this.hotelModel.findAll({include:{all:true}})
      return successResponse(hotels)
    } catch (error) {
      handleError(error)
    }
  }

  async findOne(id: number) {
    try {
      const hotel=await this.hotelModel.findOne({where:{id},include:{all:true}})
      if(!hotel){
        throw new NotFoundException('Hotel not found')
      }
      return successResponse(hotel)

    } catch (error) {
      handleError(error)
    }
  }

  async update(id: number, updateHotelDto: UpdateHotelDto) {
    try {
      const user=await this.userModel.findOne({where:{id:updateHotelDto.userId}})
      if(!user){
        throw new NotFoundException('User not found')
      }
      const hotel=await this.hotelModel.findOne({where:{id},include:{all:true}})
      if(!hotel){
        throw new NotFoundException('Hotel not found')
      }
      const updatedHotel=await this.hotelModel.update(updateHotelDto,{where:{id},returning:true})
      return successResponse(updatedHotel[1][0])
    } catch (error) {
      handleError(error)
    }
  }

  async remove(id: number) {
    try {
       const hotel=await this.hotelModel.findOne({where:{id},include:{all:true}})
      if(!hotel){
        throw new NotFoundException('Hotel not found')
      }
      const affected = await this.hotelModel.destroy({where:{id}})
      return successResponse({message:'Deleted successfully', affected})
    } catch (error) {
      handleError(error)
    }
  }
}





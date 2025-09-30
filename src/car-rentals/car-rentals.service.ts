import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarRentalDto } from './dto/create-car-rental.dto';
import { UpdateCarRentalDto } from './dto/update-car-rental.dto';
import { handleError } from 'src/utils/handle-error';
import { InjectModel } from '@nestjs/sequelize';
import { CarRental } from './entities/car-rental.entity';
import { User } from 'src/users/entities/user.entity';
import { Car } from 'src/cars/entities/car.entity';
import { successResponse } from 'src/utils/success.response';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class CarRentalsService {
  constructor(
    @InjectModel(CarRental) private readonly carRentalModel:typeof CarRental,
    @InjectModel(User) private readonly userModel:typeof User,
    @InjectModel(Car) private readonly carModel:typeof Car,
    private readonly transactionsService: TransactionsService,
  ){}
  async create(createCarRentalDto: CreateCarRentalDto) {
    try {
      const user=await this.userModel.findOne({where:{id:createCarRentalDto.userId}})
      if(!user){
        throw new NotFoundException('user not found')
      }
      const car=await this.carModel.findOne({where:{id:createCarRentalDto.carId}})
      if(!car){
        throw new NotFoundException('Car not found')
      }
      let total_price=0
      if(createCarRentalDto.ride_time>24){
        total_price=Number(car.dailyPrice) *Math.floor(createCarRentalDto.ride_time)
      }
      else{
        const hourlyPrice = car.hourlyPrice ?? car.dailyPrice ?? '0';
        total_price=Number(hourlyPrice)*createCarRentalDto.ride_time
      }
      const userBalance = Number(user.balance) || 0;
      if(userBalance<total_price){
        throw new BadRequestException('Not  enough balance')
      }
      await user.update({ balance: userBalance - total_price });
      const carRental=await this.carRentalModel.create({...createCarRentalDto,totalPrice:total_price})
      await this.transactionsService.recordTransaction({
        userId: user.id,
        amount: total_price,
        type: 'car-rental',
        description: `Car rental #${carRental.id} (${createCarRentalDto.ride_time}h)`,
      });
      return successResponse(carRental)
    } catch (error) {
      handleError(error)
    }
  }

  async findAll() {
    try {
      const carRentals=await this.carRentalModel.findAll({include:{all:true}})
      return successResponse(carRentals)
    } catch (error) {
      handleError(error)
    }
  }

  async findOne(id: number) {
    try {
      const carRental=await this.carRentalModel.findOne({where:{id}})
      if(!carRental){
        throw new NotFoundException('Car Rental not found')
      }
      return successResponse(carRental)
    } catch (error) {
      handleError(error)
    }
  }

  async update(id: number, updateCarRentalDto: UpdateCarRentalDto) {
    try {
      const user=await this.userModel.findOne({where:{id:updateCarRentalDto.userId}})
      if(!user){
        throw new NotFoundException('user not found')
      }
      const car=await this.carModel.findOne({where:{id:updateCarRentalDto.carId}})
      if(!car){
        throw new NotFoundException('Car not found')
      }
      const carRental=await this.carRentalModel.findOne({where:{id}})
      if(!carRental){
        throw new NotFoundException('Car Rental not found')
      }
      const updatedCarRental=await this.carRentalModel.update({...updateCarRentalDto}, {where:{id}, returning:true})
      return successResponse(updatedCarRental[1][0])
    } catch (error) {
      handleError(error)
    }
  }

  async remove(id: number) {
    try {
      const carRental=await this.carRentalModel.findOne({where:{id}})
      if(!carRental){
        throw new NotFoundException('Car Rental not found')
      }
      const affected = await this.carRentalModel.destroy({where:{id}})
      return successResponse({message:'Deleted successfully', affected})
    } catch (error) {
      handleError(error)
    }
  }
}





import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Car } from './entities/car.entity';
import { Company } from 'src/companies/entities/company.entity';
import { handleError } from 'src/utils/handle-error';
import { City } from 'src/cities/entities/city.entity';
import { successResponse } from 'src/utils/success.response';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car) private readonly carModel:typeof Car,
    @InjectModel(City) private readonly cityModel:typeof City,
    @InjectModel(Company) private readonly companyModel:typeof Company,
  ){}
  async create(createCarDto: CreateCarDto) {
    try {
      const company=await this.companyModel.findOne({where:{id:createCarDto.companyId}})
      if(!company){
        throw new NotFoundException('Company not found')
      }
      const city=await this.cityModel.findOne({where:{id:createCarDto.cityId}})
      if(!city){
        throw new NotFoundException('City not found')
      }
      const car=await this.carModel.create({...createCarDto})
      return successResponse(car,201)
    } catch (error) {
      handleError(error)
    }
  }

  async findAll() {
    try {
      const cars=await this.carModel.findAll({include:{all:true}})
      return successResponse(cars)
    } catch (error) {
      handleError(error)
    }
  }

  async findOne(id: number) {
    try {
      const car=await this.carModel.findOne({where:{id},include:{all:true}})
      if(!car){
        throw new NotFoundException('Car not found')
      }
      return successResponse(car)
    } catch (error) {
      handleError(error)
    }
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    try {
      const car=await this.carModel.findByPk(id)
      if(!car){
        throw new NotFoundException('Car not found')
      }

      if (updateCarDto.companyId) {
        const company=await this.companyModel.findOne({where:{id:updateCarDto.companyId}})
        if(!company){
          throw new NotFoundException('Company not found')
        }
      }

      if (updateCarDto.cityId) {
        const city=await this.cityModel.findOne({where:{id:updateCarDto.cityId}})
        if(!city){
          throw new NotFoundException('City not found')
        }
      }

      const [_, [updatedCar]] = await this.carModel.update(updateCarDto,{where:{id},returning:true})
      return successResponse(updatedCar)
    } catch (error) {
      handleError(error)
    }
  }

  async remove(id: number) {
    try {
      const car=await this.carModel.findOne({where:{id}})
      if(!car){
        throw new NotFoundException('Car not found')
      }
      const affected = await this.carModel.destroy({where:{id}})
      return successResponse({message:'Car deleted', affected})
    } catch (error) {
      handleError(error)
    }
  }
}





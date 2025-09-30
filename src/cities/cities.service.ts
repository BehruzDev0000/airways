import { Injectable, Controller, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { handleError } from 'src/utils/handle-error';
import { InjectModel } from '@nestjs/sequelize';
import { City } from './entities/city.entity';
import { Country } from 'src/countries/entities/country.entity';
import { successResponse } from 'src/utils/success.response';

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel(City) private readonly cityModel:typeof City,
    @InjectModel(Country) private readonly countryModel:typeof Country
  ){}
  async create(createCityDto: CreateCityDto) {
    try {
      const country=await this.countryModel.findOne({where:{id:createCityDto.countryId}})
      if(!country){
        throw new NotFoundException('Country not found')
      }
      const city=await this.cityModel.create({...createCityDto})
      return successResponse(city,201)
    } catch (error) {
      handleError(error)
    }
  }

  async findAll() {
    try {
      const city=await this.cityModel.findAll({include:{all:true}})
      return successResponse(city)
    } catch (error) {
      handleError(error)
    }
  }

  async findOne(id: number) {
    try {
      const city=await this.cityModel.findOne({where:{id},include:{all:true}})
      if(!city){
        throw new NotFoundException('City not found')
      }
      return successResponse(city)
    } catch (error) {
      handleError(error)
    }
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    try {
      const country=await this.countryModel.findOne({where:{id:updateCityDto.countryId}})
      if(!country){
        throw new NotFoundException('Country not found')
      }
      const city=await this.cityModel.findOne({where:{id}})
      if(!city){
        throw new NotFoundException('City not found')
      }
      const updatedCity=await this.cityModel.update(updateCityDto,{where:{id},returning:true})
      return successResponse(updatedCity[1][0])
    } catch (error) {
      handleError(error)
    }
  }

  async remove(id: number) {
    try {
       const city=await this.cityModel.findOne({where:{id}})
      if(!city){
        throw new NotFoundException('City not found')
      }
      const affected = await this.cityModel.destroy({where:{id}})
      return successResponse({message:'City deleted', affected})
    } catch (error) {
      handleError(error)
    }
  }
}



import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { handleError } from 'src/utils/handle-error';
import { InjectModel } from '@nestjs/sequelize';
import { Airport } from './entities/airport.entity';
import { City } from 'src/cities/entities/city.entity';
import { successResponse } from 'src/utils/success.response';

@Injectable()
export class AirportsService {
  constructor(
    @InjectModel(Airport) private readonly airportModel:typeof Airport,
    @InjectModel(City) private readonly cityModel:typeof City,
  ){}
  async create(createAirportDto: CreateAirportDto) {
    try {
      const city=await this.cityModel.findOne({where:{id:createAirportDto.cityId}})
      if(!city){
        throw new NotFoundException('City not found')
      }
      const airport=await this.airportModel.create({...createAirportDto})
      return successResponse(airport,201)
    } catch (error) {
      handleError(error)
    }
  }

  async findAll() {
    try {
      const airports=await this.airportModel.findAll({include:{all:true}})
      return successResponse(airports)
    } catch (error) {
      handleError(error)
    }
  }

  async findOne(id: number) {
    try {
      const airport=await this.airportModel.findByPk(id)
      if(!airport){
        throw new NotFoundException('Airport not found')
      }
      return successResponse(airport)
    } catch (error) {
      handleError(error)
    }
  }

  async update(id: number, updateAirportDto: UpdateAirportDto) {
    try {
      const city=await this.cityModel.findOne({where:{id:updateAirportDto.cityId}})
      if(!city){
        throw new NotFoundException('City not found')
      }
      const airport =await this.airportModel.findByPk(id)
      if(!airport){
        throw new NotFoundException('Airport not found')
      }
      const updatedairport =await this.airportModel.update({...updateAirportDto},{where:{id},returning:true})
      return successResponse(updatedairport[1][0])
    } catch (error) {
      handleError(error)
    }
  }

  async remove(id: number) {
    try {
      const airport=await this.airportModel.findByPk(id)
      if(!airport){
        throw new NotFoundException('Airport not found')
      }
      const affected = await this.airportModel.destroy({where:{id}})
      return successResponse({message:'Airport deleted', affected})
    } catch (error) {
      handleError(error)
    }
  }
}



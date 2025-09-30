import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { handleError } from 'src/utils/handle-error';
import { InjectModel } from '@nestjs/sequelize';
import { Country } from './entities/country.entity';
import { successResponse } from 'src/utils/success.response';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country) private readonly countryModel:typeof Country
  ){}
  async create(createCountryDto: CreateCountryDto) {
    try {
      const countryname=await this.countryModel.findOne({where:{name:createCountryDto.name}})
      if(countryname){
        throw new ConflictException('This country name already registired')
      }
      const country=await this.countryModel.create({...createCountryDto})
      return successResponse(country,201)
    } catch (error) {
      handleError(error)
    }
  }

  async findAll() {
    try {
    const countries=await this.countryModel.findAll()
    return successResponse(countries)      
    } catch (error) {
      handleError(error)
    }
  }

  async findOne(id: number) {
    try {
      const country=await this.countryModel.findOne({where:{id}})
      if(!country){
        throw new NotFoundException('Country not found')
      }
      return successResponse(country)
    } catch (error) {
      handleError(error)
    }
  }

  async update(id: number, updateCountryDto: UpdateCountryDto) {
    try {
      const country=await this.countryModel.findOne({where:{id}})
      if(!country){
        throw new NotFoundException('Country not found')
      }
      const updatedCountry=await this.countryModel.update(updateCountryDto,{where:{id},returning:true})
      return successResponse(updatedCountry[1][0])
    } catch (error) {
      handleError(error)
    }
  }

  async remove(id: number) {
    try {
      const country=await this.countryModel.findOne({where:{id}})
      if(!country){
        throw new NotFoundException('Country not found')
      }
      const affected=await this.countryModel.destroy({where:{id}})
      return successResponse({message:'Country deleted', affected})
    } catch (error) {
      handleError(error)
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { handleError } from 'src/utils/handle-error';
import { InjectModel } from '@nestjs/sequelize';
import { Company } from './entities/company.entity';
import { successResponse } from 'src/utils/success.response';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company) private readonly companyModel: typeof Company,
  ){}
  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const company=await this.companyModel.create({...createCompanyDto})
      return successResponse(company,201)
    } catch (error) {
      handleError(error)
    }
  }

  async findAll() {
    try {
      const companies=await this.companyModel.findAll()
      return successResponse(companies)
    } catch (error) {
      handleError(error)
    }
  }

  async findOne(id: number) {
  try {
    const company=await this.companyModel.findOne({where:{id}})
    if(!company){
      throw new NotFoundException('Company not found')
    }
    return successResponse(company)
  } catch (error) {
    handleError(error)
  }
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    try {
      const company=await this.companyModel.findOne({where:{id}})
      if(!company){
        throw new NotFoundException('Company not found')
      }
      const updatedCompany=await this.companyModel.update(UpdateCompanyDto,{where:{id},returning:true})

      return successResponse(updatedCompany[1][0])
    } catch (error) {
      handleError(error)
    }
  }

  async remove(id: number) {
    try {
      const company=await this.companyModel.findOne({where:{id}})
      if(!company){
        throw new NotFoundException('Company not found')
      }
      const affected = await this.companyModel.destroy({where:{id}})
      return successResponse({message:'Company deleted', affected})
    } catch (error) {
      handleError(error)
    }
  }
}



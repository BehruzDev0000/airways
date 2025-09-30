import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaneDto } from './dto/create-plane.dto';
import { UpdatePlaneDto } from './dto/update-plane.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Plane } from './entities/plane.entity';
import { Company } from 'src/companies/entities/company.entity';
import { handleError } from 'src/utils/handle-error';
import { successResponse } from 'src/utils/success.response';

@Injectable()
export class PlanesService {
  constructor(
    @InjectModel(Plane) private readonly planeModel:typeof Plane,
    @InjectModel(Company) private readonly companyModel:typeof Company
  ){}
  async create(createPlaneDto: CreatePlaneDto) {
    try {
      const company=await this.companyModel.findOne({where:{id:createPlaneDto.companyId}})
      if(!company){
        throw new NotFoundException('Company not found')
      }
      const plane=await this.planeModel.create({...createPlaneDto})
      return successResponse(plane,201)
    } catch (error) {
      handleError(error)
    }
  }

  async findAll() {
    try {
      const planes=await this.planeModel.findAll({include:{all:true}})
      return successResponse(planes)
    } catch (error) {
      handleError(error)
    }
  }

  async findOne(id: number) {
    try {
      const plane=await this.planeModel.findOne({where:{id},include:{all:true}})
      if(!plane){
        throw new NotFoundException('Plane not found')
      }
      return successResponse(plane)
    } catch (error) {
      handleError(error)
    }
  }

  async update(id: number, updatePlaneDto: UpdatePlaneDto) {
    try {
      const company=await this.companyModel.findOne({where:{id:updatePlaneDto.companyId}})

      if(!company){
        throw new NotFoundException('Company not found')
      }

      const plane=await this.planeModel.findOne({where:{id},include:{all:true}})

      if(!plane){
        throw new NotFoundException('Plane not found')
      }
      const updatedPlane=await this.planeModel.update(updatePlaneDto,{where:{id},returning:true})
      return successResponse(updatedPlane[1][0])
    } catch (error) {
      handleError(error)
    }
  }

  async remove(id: number) {
    try {
       const plane=await this.planeModel.findOne({where:{id},include:{all:true}})

      if(!plane){
        throw new NotFoundException('Plane not found')
      }
      const affected = await this.planeModel.destroy({where:{id}})
      return successResponse({message:'Deleted successfully', affected})
    } catch (error) {
      handleError(error)
    } 
  }
}





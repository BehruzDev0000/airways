import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { handleError } from 'src/utils/handle-error';
import { InjectModel } from '@nestjs/sequelize';
import { Class } from './entities/class.entity';
import { successResponse } from 'src/utils/success.response';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(Class)private readonly classModel:typeof Class
  ){}
  async create(createClassDto: CreateClassDto) {
    try {
      const newclass=await this.classModel.create({...createClassDto})
      return successResponse(newclass)
    } catch (error) {
      handleError(error)
    }  
  }

  async findAll() {
    try {
      const classes=await this.classModel.findAll({include:{all:true}})
      return successResponse(classes)
    } catch (error) {
      handleError(error)
    }  
  }

  async findOne(id: number) {
    try {
      const classfound=await this.classModel.findOne({where:{id},include:{all:true}})
      if(!classfound){
        throw new NotFoundException('Class not found')
      }
      return successResponse(classfound)
    } catch (error) {
      handleError(error)
    }  
  }

  async update(id: number, updateClassDto: UpdateClassDto) {
    try {
      const classfound=await this.classModel.findOne({where:{id}})
      if(!classfound){
        throw new NotFoundException('Class not found')
      }
      const updatedclass=await this.classModel.update(updateClassDto,{where:{id},returning:true})
      return successResponse(updatedclass[1][0])
    } catch (error) {
      handleError(error)
    }  
  }

  async remove(id: number) {
    try {
      const classfound=await this.classModel.findOne({where:{id}})
      if(!classfound){
        throw new NotFoundException('Class not found')
      }
      const affected = await this.classModel.destroy({where:{id}})
      return successResponse({message:'Deleted successfully', affected})
    } catch (error) {
      handleError(error)
    }  
  }
}





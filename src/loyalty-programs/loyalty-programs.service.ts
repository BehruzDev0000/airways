import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoyaltyProgramDto } from './dto/create-loyalty-program.dto';
import { UpdateLoyaltyProgramDto } from './dto/update-loyalty-program.dto';
import { handleError } from 'src/utils/handle-error';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import { LoyaltyProgram } from './entities/loyalty-program.entity';
import { successResponse } from 'src/utils/success.response';

@Injectable()
export class LoyaltyProgramsService {
  constructor(
    @InjectModel(User) private readonly userModel:typeof User,
    @InjectModel(LoyaltyProgram) private readonly loyaltyLevelModel:typeof LoyaltyProgram
  ){}
    async create(createLoyaltyProgramDto: CreateLoyaltyProgramDto) {
  try {
    const user=await this.userModel.findOne({where:{id:createLoyaltyProgramDto.userId}})
    if(!user){
      throw new NotFoundException('User not found')
    }
    const loyalty=await this.loyaltyLevelModel.create({...createLoyaltyProgramDto})
    return successResponse(loyalty)
  } catch (error) {
    handleError(error)
  }
  }
  async findAll() {
    try {
      const loyalties=await this.loyaltyLevelModel.findAll({include:{all:true}})
      return successResponse(loyalties)
    } catch (error) {
      handleError(error)
    }
  }

  async findOne(id: number) {
    try {
      const loyalty=await this.loyaltyLevelModel.findOne({where:{id}})
      if(!loyalty){
        throw new NotFoundException('Loyalty Program not found')
      }
      return successResponse(loyalty)
    } catch (error) {
      handleError(error)
    }
  }

  async update(id: number, updateLoyaltyProgramDto: UpdateLoyaltyProgramDto) {
    try {
      const user=await this.userModel.findOne({where:{id:updateLoyaltyProgramDto.userId}})
    if(!user){
      throw new NotFoundException('User not found')
    }
      const loyalty=await this.loyaltyLevelModel.findOne({where:{id}})
      if(!loyalty){
        throw new NotFoundException('Loyalty Program not found')
      }
      const updatedLoyalty=await this.loyaltyLevelModel.update(updateLoyaltyProgramDto,{where:{id},returning:true})
      return successResponse(updatedLoyalty[1][0])
    } catch (error) {
      handleError(error)
    }
  }

  async remove(id: number) {
    try {
      const loyalty=await this.loyaltyLevelModel.findOne({where:{id}})
      if(!loyalty){
        throw new NotFoundException('Loyalty Program not found')
      }
      const affected = await this.loyaltyLevelModel.destroy({where:{id}})
      return successResponse({message:'Loyalty program deleted', affected})
    } catch (error) {
      handleError(error)
    }
  }
}



import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { handleError } from 'src/utils/handle-error';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './entities/review.entity';
import { Flight } from 'src/flights/entities/flight.entity';
import { User } from 'src/users/entities/user.entity';
import { successResponse } from 'src/utils/success.response';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review) private readonly reviewModel:typeof Review,
    @InjectModel(Flight) private readonly flightModel:typeof Flight,
    @InjectModel(User) private readonly userModel:typeof User
  ){}
  async create(createReviewDto: CreateReviewDto) {
    try {
      const user=await this.userModel.findOne({where:{id:createReviewDto.userId}})
      if(!user){
        throw new NotFoundException('User not found')
      }
      const flight =await this.flightModel.findOne({where:{id:createReviewDto.flightId}})
      if(!flight){
        throw new NotFoundException('Flight not found')
      }
      const review=await this.reviewModel.create({...createReviewDto})
      return successResponse(review)
    } catch (error) {
      handleError(error)
    }
  }

  async findAll() {
    try {
      const reviews=await this.reviewModel.findAll({include:{all:true}})
      return successResponse(reviews)
    } catch (error) {
      handleError(error)
    }
  }

  async findOne(id: number) {
    try {
      const review=await this.reviewModel.findOne({where:{id},include:{all:true}})
      if(!review){
         throw new NotFoundException('Review not found')
      }  
      return successResponse(review)
    } catch (error) {
      handleError(error)
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    try {
      const user=await this.userModel.findOne({where:{id:updateReviewDto.userId}})
      if(!user){
        throw new NotFoundException('User not found')
      }
      const flight =await this.flightModel.findOne({where:{id:updateReviewDto.flightId}})
      if(!flight){
        throw new NotFoundException('Flight not found')
      }
      const review=await this.reviewModel.findOne({where:{id}})
      if(!review){
         throw new NotFoundException('Review not found')
      }  
      const updatedReview=await this.reviewModel.update(updateReviewDto,{where:{id},returning:true})
      return successResponse(updatedReview[1][0])
    } catch (error) {
      handleError(error)
    }
  }

  async remove(id: number) {
    try {
      const review=await this.reviewModel.findOne({where:{id}})
      if(!review){
         throw new NotFoundException('Review not found')
      } 
      const affected = await this.reviewModel.destroy({where:{id}})
      return successResponse({message:'Deleted successfully', affected}) 
    } catch (error) {
      handleError(error)
    }
  }
}





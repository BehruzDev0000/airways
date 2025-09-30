import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { handleError } from 'src/utils/handle-error';
import { InjectModel } from '@nestjs/sequelize';
import { News } from './entities/news.entity';
import { successResponse } from 'src/utils/success.response';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News) private readonly newsModel:typeof News
  ){}
  async create(createNewsDto: CreateNewsDto, imageUrl?: string) {
    try {
      const originImage=imageUrl
      if(!originImage){
        throw new NotFoundException('Image not found')
      }
      const news=await this.newsModel.create({
        ...createNewsDto,
        image:imageUrl
      })
      return successResponse(news,201)
    } catch (error) {
      handleError(error)
    }
  }

  async findAll() {
    try {
      const news=await this.newsModel.findAll()
      return successResponse(news)
    } catch (error) {
      handleError(error)
    }
  }

  async findOne(id: number) {
    try {
      const news=await this.newsModel.findOne({where:{id}})
      if(!news){
        throw new NotFoundException('News not found')
      }
      return successResponse(news)
    } catch (error) {
      handleError(error)
    }
  }

  async update(id: number, updateNewsDto: UpdateNewsDto, imageUrl: string | undefined) {
    try {
      const image=await this.newsModel.findOne({where:{image:imageUrl}})
      if(image){
        throw new ConflictException('Image already exists')
      }
      const news=await this.newsModel.findOne({where:{id}})
      if(!news){
        throw new NotFoundException('News not found')
      }
      const updatedNews=await this.newsModel.update(
        {...updateNewsDto,image:imageUrl},{where:{id},returning:true}
      )
      return successResponse(updatedNews[1][0])
    } catch (error) {
      handleError(error)
    }
  }

  async remove(id: number) {
    try {
       const news=await this.newsModel.findOne({where:{id}})
      if(!news){
        throw new NotFoundException('News not found')
      }
      const affected = await this.newsModel.destroy({where:{id}})
      return successResponse({message:'Deleted successfully', affected})
    } catch (error) {
      handleError(error)
    }
  }
}





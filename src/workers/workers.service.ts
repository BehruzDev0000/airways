import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { handleError } from 'src/utils/handle-error';
import { InjectModel } from '@nestjs/sequelize';
import { Worker } from './entities/worker.entity';
import { successResponse } from 'src/utils/success.response';
@Injectable()
export class WorkersService {
  constructor(
    @InjectModel(Worker) private readonly workerModel:typeof Worker
  ){}

  async findAll() {
    try {
      const workers=await this.workerModel.findAll()
      return successResponse(workers)
    } catch (error) {
      handleError(error)
    }
  }

  async findOne(id: number) {
    try {
      const worker=await this.workerModel.findOne({where:{id}})
      if(!worker){
        throw new NotFoundException('Worker not found')
      }
      return successResponse(worker)
    } catch (error) {
      handleError(error)
    }
  }

  async update(id: number, updateWorkerDto: UpdateWorkerDto) {
    try {
      const worker=await this.workerModel.findOne({where:{id}})
      if(!worker){
        throw new NotFoundException('Worker not found')
      }
      const updatedWorker=await this.workerModel.update(updateWorkerDto,{where:{id},returning:true})
      return successResponse(updatedWorker[1][0])
    } catch (error) {
      handleError(error)
    }
  }

  async remove(id: number) {
    try {
      const worker=await this.workerModel.findOne({where:{id}})
      if(!worker){
        throw new NotFoundException('Worker not found')
      }
      await this.workerModel.destroy({
        where:{id}
      }) 
      return successResponse({message:'Worker deleted sucessfully'})
    } catch (error) {
      handleError(error)
    }
  }
}

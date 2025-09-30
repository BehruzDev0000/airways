import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { handleError } from 'src/utils/handle-error';
import { InjectModel } from '@nestjs/sequelize';
import { Seat } from './entities/seat.entity';
import { Class } from 'src/classes/entities/class.entity';
import { successResponse } from 'src/utils/success.response';
import { Plane } from 'src/planes/entities/plane.entity';
import { Op } from 'sequelize';

@Injectable()
export class SeatsService {
  constructor(
    @InjectModel(Seat) private readonly seatModel:typeof Seat ,
    @InjectModel(Class) private readonly classModel:typeof Class,
    @InjectModel(Plane) private readonly planeModel:typeof Plane,
  ){}
  async create(createSeatDto: CreateSeatDto) {
    try {
      const plane=await this.planeModel.findByPk(createSeatDto.planeId)
      if(!plane){
        throw new NotFoundException('Plane not found')
      }

      const seatClass=await this.classModel.findByPk(createSeatDto.classId)
      if(!seatClass){
        throw new NotFoundException('Class not found')
      }

      const existingSeat = await this.seatModel.findOne({
        where: {
          planeId: createSeatDto.planeId,
          seatNumber: createSeatDto.seatNumber,
        }
      })

      if(existingSeat){
        throw new ConflictException('Seat number already exists for this plane')
      }

      const seat=await this.seatModel.create({...createSeatDto})
      return successResponse(seat,201)
    } catch (error) {
      handleError(error)
    }
  }

  async findAll() {
    try {
      const seats=await this.seatModel.findAll({include:{all:true}})
      return successResponse(seats)
    } catch (error) {
      handleError(error)
    }
  }

  async findOne(id: number) {
    try {
      const seat=await this.seatModel.findOne({where:{id},include:{all:true}})
      if(!seat){
        throw new NotFoundException('Seat not found')
      }
      return successResponse(seat)
    } catch (error) {
      handleError(error)
    }
  }

  async update(id: number, updateSeatDto: UpdateSeatDto) {
    try {
      const seat=await this.seatModel.findByPk(id)
      if(!seat){
        throw new NotFoundException('Seat not found')
      }

      const planeId = updateSeatDto.planeId ?? seat.planeId
      const classId = updateSeatDto.classId ?? seat.classId
      const seatNumber = updateSeatDto.seatNumber ?? seat.seatNumber

      const plane = await this.planeModel.findByPk(planeId)
      if(!plane){
        throw new NotFoundException('Plane not found')
      }

      const seatClass=await this.classModel.findByPk(classId)
      if(!seatClass){
        throw new NotFoundException('Class not found')
      }

      const existingSeat = await this.seatModel.findOne({
        where: {
          planeId,
          seatNumber,
          id: { [Op.ne]: id },
        }
      })

      if(existingSeat){
        throw new ConflictException('Seat number already exists for this plane')
      }

      const [_, [updatedSeat]] = await this.seatModel.update({
        ...updateSeatDto,
      },{where:{id},returning:true})
      return successResponse(updatedSeat)
    } catch (error) {
      handleError(error)
    }
  }

  async remove(id: number) {
    try {
      const seat=await this.seatModel.findOne({where:{id}})
      if(!seat){
        throw new NotFoundException('Seat not found')
      }
      const affected = await this.seatModel.destroy({where:{id}})
      return successResponse({message:'Deleted successfully', affected})
    } catch (error) {
      handleError(error)
    }
  }
}





import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { handleError } from 'src/utils/handle-error';
import { InjectModel } from '@nestjs/sequelize';
import { Flight } from 'src/flights/entities/flight.entity';
import { User } from 'src/users/entities/user.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { Class } from 'src/classes/entities/class.entity';
import { Ticket } from './entities/ticket.entity';
import { successResponse } from 'src/utils/success.response';
import { Plane } from 'src/planes/entities/plane.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Op } from 'sequelize';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Flight) private readonly flightModel:typeof Flight,
    @InjectModel(User) private readonly userModel:typeof User,
    @InjectModel(Seat) private readonly seatModel:typeof Seat,
    @InjectModel(Class) private readonly classModel:typeof Class,
    @InjectModel(Ticket) private readonly ticketModel:typeof Ticket,
    @InjectModel(Plane) private readonly planeModel: typeof Plane,
    private readonly transactionsService: TransactionsService,
  ){}
  async create(createTicketDto: CreateTicketDto) {
    try {
      const flight =await this.flightModel.findOne({where:{id:createTicketDto.flightId}})
      if(!flight){
        throw new NotFoundException('Flight not found')
      }
      const user=await this.userModel.findOne({where:{id:createTicketDto.userId}})
      if(!user){
        throw new NotFoundException('User not found')
      }
      const seat=await this.seatModel.findOne({where:{id:createTicketDto.seatsId}})
      if(!seat){
        throw new NotFoundException('Seat not found')
      }
      if(seat.planeId !== flight.planeId){
        throw new BadRequestException('Seat does not belong to the plane used for this flight');
      }
      const planeClass=await this.classModel.findOne({where:{id:createTicketDto.classId}})
      if(!planeClass){
        throw new NotFoundException('Class not found')
      }
      if(seat.classId && seat.classId !== planeClass.id){
        throw new BadRequestException('Seat class does not match selected class');
      }
      const plane = await this.planeModel.findOne({ where: { id: flight.planeId } });
      if (!plane) {
        throw new NotFoundException('Plane not found');
      }
      const seatsTaken = await this.ticketModel.count({ where: { flightId: flight.id } });
      if (seatsTaken >= plane.capacity) {
        throw new BadRequestException('No available seats for this flight');
      }
      const seatBooked = await this.ticketModel.findOne({ where: { flightId: flight.id, seatsId: seat.id } });
      if (seatBooked) {
        throw new BadRequestException('Selected seat is already booked for this flight');
      }
      const ticketPrice = Number(planeClass.price) || 0;
      const userBalance = Number(user.balance) || 0;
      if(userBalance<ticketPrice){
        throw new BadRequestException('Not enough balance')
      }
      await user.update({ balance: userBalance - ticketPrice });
      const ticket=await this.ticketModel.create({
        ...createTicketDto,
        price:ticketPrice
      })
      await this.transactionsService.recordTransaction({
        userId: user.id,
        amount: ticketPrice,
        type: 'ticket',
        description: `Ticket purchase for flight ${flight.id}`,
      });
      return successResponse(ticket,201)
    } catch (error) {
      handleError(error)
    }
  }

  async findAll() {
    try {
      const tickets=await this.ticketModel.findAll({
        include:{all:true}
      })
      return successResponse(tickets)
    } catch (error) {
      handleError(error)
    }
  }

  async findOne(id: number) {
    try {
      const ticket=await this.ticketModel.findOne({
        where:{id},
        include:{all:true}
      })
      if(!ticket){
        throw new NotFoundException('Ticket not found')
      }
      return successResponse(ticket)
    } catch (error) {
      handleError(error)
    }
  }

  async update(id: number, updateTicketDto: UpdateTicketDto) {
    try {
       const flight =await this.flightModel.findOne({where:{id:updateTicketDto.flightId}})
      if(!flight){
        throw new NotFoundException('Flight not found')
      }
      const user=await this.userModel.findOne({where:{id:updateTicketDto.userId}})
      if(!user){
        throw new NotFoundException('User not found')
      }
      const seat=await this.seatModel.findOne({where:{id:updateTicketDto.seatsId}})
      if(!seat){
        throw new NotFoundException('Seat not found')
      }
      if(seat.planeId !== flight.planeId){
        throw new BadRequestException('Seat does not belong to the plane used for this flight');
      }
      const planeClass=await this.classModel.findOne({where:{id:updateTicketDto.classId}})
      if(!planeClass){
        throw new NotFoundException('Class not found')
      }
      if(seat.classId && seat.classId !== planeClass.id){
        throw new BadRequestException('Seat class does not match selected class');
      }
      const ticket=await this.ticketModel.findOne({where:{id}})
      if(!ticket){
        throw new NotFoundException('Ticket not found')
      }
      const plane = await this.planeModel.findOne({ where: { id: flight.planeId } });
      if (!plane) {
        throw new NotFoundException('Plane not found');
      }
      const seatsTaken = await this.ticketModel.count({ where: { flightId: flight.id, id: { [Op.ne]: ticket.id } } });
      if (seatsTaken >= plane.capacity) {
        throw new BadRequestException('No available seats for this flight');
      }
      const duplicateSeat = await this.ticketModel.findOne({
        where: {
          flightId: updateTicketDto.flightId,
          seatsId: updateTicketDto.seatsId,
        },
      });
      if (duplicateSeat && duplicateSeat.id !== ticket.id) {
        throw new BadRequestException('Selected seat is already booked for this flight');
      }
      const updatedTicket=await this.ticketModel.update({
        ...updateTicketDto,
        price:planeClass.price
      },{where:{id},returning:true})
      return successResponse(updatedTicket[1][0])
    } catch (error) {
      handleError(error)
    }
  }

  async remove(id: number) {
    try {
      const ticket=await this.ticketModel.findOne({where:{id}})
      if(!ticket){
        throw new NotFoundException('Ticket not found')
      }
      const affected = await this.ticketModel.destroy({where:{id}})
      return successResponse({message:'Deleted successfully', affected})
    } catch (error) {
      handleError(error)
    }
  }
}





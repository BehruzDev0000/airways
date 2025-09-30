import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { handleError } from 'src/utils/handle-error';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Flight } from './entities/flight.entity';
import { Airport } from 'src/airports/entities/airport.entity';
import { Plane } from 'src/planes/entities/plane.entity';
import { successResponse } from 'src/utils/success.response';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class FlightsService {
  constructor(
    @InjectModel(Flight) private readonly flightModel:typeof Flight,
    @InjectModel(Airport) private readonly airportModel:typeof Airport,
    @InjectModel(Plane) private readonly planeModel:typeof Plane,
    @InjectConnection() private readonly sequelize: Sequelize,
  ){}
  async create(createFlightDto: CreateFlightDto) {
    try {
      const tx = await this.sequelize.transaction();
      const plane = await this.planeModel.findByPk(createFlightDto.planeId, { transaction: tx });
      if (!plane) {
        await tx.rollback();
        throw new NotFoundException('Plane not found');
      }

      const departureAirport = await this.airportModel.findByPk(createFlightDto.departureAirportId, { transaction: tx });
      if (!departureAirport) {
        await tx.rollback();
        throw new NotFoundException('Departure airport not found');
      }

      const arrivalAirport = await this.airportModel.findByPk(createFlightDto.arrivalAirportId, { transaction: tx });
      if (!arrivalAirport) {
        await tx.rollback();
        throw new NotFoundException('Arrival airport not found');
      }

      if (departureAirport.id === arrivalAirport.id) {
        throw new BadRequestException('Arrival and departure airports must be different');
      }

      if (new Date(createFlightDto.arrivalTime) <= new Date(createFlightDto.departureTime)) {
        throw new BadRequestException('Arrival time must be later than departure time');
      }

      const flight = await this.flightModel.create({ ...createFlightDto }, { transaction: tx });
      await tx.commit();
      return successResponse(flight,201)
    } catch (error) {
      handleError(error)
    }
  }

  async findAll() {
    try {
      const flights = await this.flightModel.findAll({
        include: [
          { model: Plane, attributes: { exclude: ['createdAt', 'updatedAt'] } },
          { model: Airport, as: 'departureAirport' },
          { model: Airport, as: 'arrivalAirport' },
        ],
      })
      return successResponse(flights)
    } catch (error) {
      handleError(error)
    }
  }

  async findOne(id: number) {
    try {
      const flight=await this.flightModel.findOne({
        where:{id},
        include: [
          { model: Plane, attributes: { exclude: ['createdAt', 'updatedAt'] } },
          { model: Airport, as: 'departureAirport' },
          { model: Airport, as: 'arrivalAirport' },
        ],
      })
      if(!flight){
        throw new NotFoundException('Flight not found')
      }
      return successResponse(flight)
    } catch (error) {
      handleError(error)
    }
  }

  async search(departure: string, arrival: string, date?: string, start?: string, end?: string) {
    try {
      if (!departure || !arrival) {
        throw new BadRequestException('departureAirport va arrivalAirport talab qilinadi');
      }

      const resolveAirport = async (value: string) => {
        if (/^\d+$/.test(value)) {
          const byId = await this.airportModel.findByPk(Number(value));
          if (!byId) throw new NotFoundException('Airport not found');
          return byId;
        }
        const code = value.trim();
        const byCode = await this.airportModel.findOne({ where: { code } });
        if (!byCode) throw new NotFoundException(`Airport not found: ${value}`);
        return byCode;
      };

      const dep = await resolveAirport(departure);
      const arr = await resolveAirport(arrival);

      let startDt: Date | undefined;
      let endDt: Date | undefined;
      if (start && end) {
        startDt = new Date(start);
        endDt = new Date(end);
        if (isNaN(startDt.getTime()) || isNaN(endDt.getTime())) {
          throw new BadRequestException('start/end noto\'g\'ri ISO formatda');
        }
      } else if (date) {
        const day = new Date(date);
        if (isNaN(day.getTime())) {
          throw new BadRequestException('date noto\'g\'ri formatda (YYYY-MM-DD)');
        }
        startDt = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), 0, 0, 0, 0));
        endDt = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), 23, 59, 59, 999));
      } else {
        throw new BadRequestException('date yoki start/end birini yuboring');
      }

      const flights = await this.flightModel.findAll({
        where: {
          departureAirportId: dep.id,
          arrivalAirportId: arr.id,
          departureTime: { [Op.between]: [startDt!, endDt!] },
        },
        include: [
          { model: Plane, attributes: { exclude: ['createdAt', 'updatedAt'] } },
          { model: Airport, as: 'departureAirport' },
          { model: Airport, as: 'arrivalAirport' },
        ],
        order: [['departureTime', 'ASC']],
      });
      return successResponse(flights);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateFlightDto: UpdateFlightDto) {
    try {
      const tx = await this.sequelize.transaction();
      const flight=await this.flightModel.findByPk(id, { transaction: tx })
      if(!flight){
        await tx.rollback();
        throw new NotFoundException('Flight not found')
      }

      if (updateFlightDto.planeId) {
        const plane = await this.planeModel.findByPk(updateFlightDto.planeId, { transaction: tx })
        if (!plane) {
          await tx.rollback();
          throw new NotFoundException('Plane not found')
        }
      }

      if (updateFlightDto.departureAirportId) {
        const departureAirport = await this.airportModel.findByPk(updateFlightDto.departureAirportId, { transaction: tx })
        if (!departureAirport) {
          await tx.rollback();
          throw new NotFoundException('Departure airport not found')
        }
        const targetArrivalId = updateFlightDto.arrivalAirportId ?? flight.arrivalAirportId
        if (targetArrivalId === departureAirport.id) {
          throw new BadRequestException('Arrival and departure airports must be different')
        }
      }

      if (updateFlightDto.arrivalAirportId) {
        const arrivalAirport = await this.airportModel.findByPk(updateFlightDto.arrivalAirportId, { transaction: tx })
        if (!arrivalAirport) {
          await tx.rollback();
          throw new NotFoundException('Arrival airport not found')
        }
        const targetDepartureId = updateFlightDto.departureAirportId ?? flight.departureAirportId
        if (targetDepartureId === arrivalAirport.id) {
          throw new BadRequestException('Arrival and departure airports must be different')
        }
      }

      const effectiveDepartureTime = updateFlightDto.departureTime ?? flight.departureTime?.toISOString();
      const effectiveArrivalTime = updateFlightDto.arrivalTime ?? flight.arrivalTime?.toISOString();

      if (effectiveDepartureTime && effectiveArrivalTime) {
        if (new Date(effectiveArrivalTime) <= new Date(effectiveDepartureTime)) {
          throw new BadRequestException('Arrival time must be later than departure time')
        }
      }

      const [_, [updated]] = await this.flightModel.update(updateFlightDto,{
        where:{id},
        returning:true,
        transaction: tx,
      })
      await tx.commit();
      return successResponse(updated)
    } catch (error) {
      handleError(error)
    }
  }

  async remove(id: number) {
   try {
    const flight=await this.flightModel.findOne({where:{id}})
      if(!flight){
        throw new NotFoundException('Flight not found')
      }
      const affected = await this.flightModel.destroy({where:{id}})
      return successResponse({message:'Flight deleted', affected})
   } catch (error) {
    handleError(error)
   }
  }
}


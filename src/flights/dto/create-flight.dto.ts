import { IsDateString, IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { FlightStatus } from "../enums/flight.enum";

export class CreateFlightDto {
  @ApiProperty({ example: 1, description: "Plane ID" })
  @IsNumber()
  @IsNotEmpty()
  planeId: number;

  @ApiProperty({ example: 10, description: "Departure airport ID" })
  @IsNumber()
  @IsNotEmpty()
  departureAirportId: number;

  @ApiProperty({ example: 20, description: "Arrival airport ID" })
  @IsNumber()
  @IsNotEmpty()
  arrivalAirportId: number;

  @ApiProperty({ example: "2025-09-25T10:30:00Z", description: "Departure time (ISO date)" })
  @IsDateString()
  @IsNotEmpty()
  departureTime: string;

  @ApiProperty({ example: "2025-09-25T14:45:00Z", description: "Arrival time (ISO date)" })
  @IsDateString()
  @IsNotEmpty()
  arrivalTime: string;

  @ApiProperty({ enum: FlightStatus, example: FlightStatus.SCHEDULED, description: "Flight status" })
  @IsEnum(FlightStatus)
  @IsNotEmpty()
  status: FlightStatus;
}

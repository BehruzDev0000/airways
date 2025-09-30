import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { TicketStatus } from "../enums/ticket.enum";

export class CreateTicketDto {
  @ApiProperty({ example: 1, description: "Flight ID" })
  @IsNumber()
  @IsNotEmpty()
  flightId: number;

  @ApiProperty({ example: 42, description: "User ID" })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 15, description: "Seat ID" })
  @IsNumber()
  @IsNotEmpty()
  seatsId: number;

  @ApiProperty({ example: 2, description: "Class ID (e.g., Economy, Business)" })
  @IsNumber()
  @IsNotEmpty()
  classId: number;

  @ApiProperty({ enum: TicketStatus, example: TicketStatus.BOOKED, description: "Ticket status" })
  @IsEnum(TicketStatus)
  @IsNotEmpty()
  status: TicketStatus;
}

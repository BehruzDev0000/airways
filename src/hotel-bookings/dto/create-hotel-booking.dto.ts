import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BookingStatus } from "../enums/hotel.enum";

export class CreateHotelBookingDto {
  @ApiProperty({ example: 1, description: "User ID" })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 5, description: "Hotel ID" })
  @IsNumber()
  @IsNotEmpty()
  hotelId: number;

  @ApiProperty({ example: "Deluxe Suite", description: "Type of hotel room" })
  @IsString()
  @IsNotEmpty()
  room_type: string;

  @ApiProperty({ example: 150, description: "Total booking price" })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: "2025-10-01T12:00:00Z", description: "Check-in date (ISO format)" })
  @IsDateString()
  @IsNotEmpty()
  check_in: string;

  @ApiProperty({ example: "2025-10-05T12:00:00Z", description: "Check-out date (ISO format)" })
  @IsDateString()
  @IsNotEmpty()
  check_out: string;

  @ApiProperty({ enum: BookingStatus, example: BookingStatus.Pending, description: "Booking status" })
  @IsEnum(BookingStatus)
  @IsNotEmpty()
  status: BookingStatus;
}

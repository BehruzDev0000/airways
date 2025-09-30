import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CarBookingStatus } from "../enums/car.enum";

export class CreateCarRentalDto {
  @ApiProperty({ example: 1, description: "User ID" })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 10, description: "Car ID" })
  @IsNumber()
  @IsNotEmpty()
  carId: number;

  @ApiProperty({ example: "Tashkent International Airport", description: "Pick-up location" })
  @IsString()
  @IsNotEmpty()
  pickUpLocation: string;

  @ApiProperty({ example: "Samarkand Railway Station", description: "Drop-off location" })
  @IsString()
  @IsNotEmpty()
  dropOffUpLocation: string;

  @ApiProperty({ example: 5, description: "Ride time in hours" })
  @IsNumber()
  @IsNotEmpty()
  ride_time: number;

  @ApiProperty({ enum: CarBookingStatus, example: CarBookingStatus.IN_PROGRESS, description: "Booking status" })
  @IsEnum(CarBookingStatus)
  @IsNotEmpty()
  status: CarBookingStatus;
}

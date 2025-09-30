import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { FlightClass } from "../enums/class.enum";

export class CreateClassDto {
  @ApiProperty({ enum: FlightClass, example: FlightClass.ECONOMY, description: "Flight class" })
  @IsEnum(FlightClass)
  @IsNotEmpty()
  name: FlightClass;

  @ApiProperty({example:1,description:"Class price"})
  @IsNumber()
  @IsNotEmpty()
  price: number;
}

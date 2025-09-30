import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAirportDto {
  @ApiProperty({ example: 1, description: "City ID" })
  @IsNumber()
  @IsNotEmpty()
  cityId: number;

  @ApiProperty({ example: "Tashkent International Airport", description: "Airport name" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "TAS", description: "Airport IATA code" })
  @IsString()
  @IsNotEmpty()
  code: string;
}

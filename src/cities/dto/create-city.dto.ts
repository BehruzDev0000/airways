import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCityDto {
  @ApiProperty({ example: 1, description: "Country ID" })
  @IsNumber()
  @IsNotEmpty()
  countryId: number;

  @ApiProperty({ example: "Tashkent", description: "City name" })
  @IsString()
  @IsNotEmpty()
  name: string;
}

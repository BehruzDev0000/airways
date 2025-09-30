import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Airlines } from "../enums/company.enum";

export class CreateCompanyDto {
  @ApiProperty({ example: "Uzbekistan Airways", description: "Airline company name" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: Airlines, example: Airlines.UzbekistanAirways, description: "Airline company code" })
  @IsEnum(Airlines)
  @IsNotEmpty()
  code: Airlines;
}

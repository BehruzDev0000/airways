import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCarDto {
  @ApiProperty({ example: 1, description: "Company ID" })
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  @ApiProperty({ example: "+998901234567", description: "Company phone number" })
  @IsString()
  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: "Chevrolet Malibu", description: "Car model" })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: "100", description: "Daily rental price" })
  @IsString()
  @IsNotEmpty()
  dailyPrice: string;

  @ApiProperty({ example: "15", description: "Hourly rental price" })
  @IsString()
  @IsNotEmpty()
  hourlyPrice: string;

  @ApiProperty({ example: 5, description: "City ID" })
  @IsNumber()
  @IsNotEmpty()
  cityId: number;
}

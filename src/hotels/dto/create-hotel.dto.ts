import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateHotelDto {
  @ApiProperty({ example: "Hyatt Regency Tashkent", description: "Hotel name" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1, description: "Owner/User ID" })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: "Navoi Street 1A, Tashkent, Uzbekistan", description: "Hotel address" })
  @IsString()
  @IsNotEmpty()
  adress: string;

  @ApiProperty({ example: 5, description: "Hotel star rating" })
  @IsNumber()
  @IsNotEmpty()
  stars: number;
}

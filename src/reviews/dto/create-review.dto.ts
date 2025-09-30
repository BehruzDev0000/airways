import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateReviewDto {
  @ApiProperty({ example: 1, description: "User ID" })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 25, description: "Flight ID" })
  @IsNumber()
  @IsNotEmpty()
  flightId: number;

  @ApiProperty({ example: 4, description: "Rating given to the flight (1-5)" })
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @ApiProperty({ example: "Great service and comfortable seats!", description: "User comment" })
  @IsString()
  @IsNotEmpty()
  comment: string;
}

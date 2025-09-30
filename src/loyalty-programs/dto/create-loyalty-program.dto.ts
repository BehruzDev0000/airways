import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { LoyaltyLevel } from "../enums/loyalty.enum";

export class CreateLoyaltyProgramDto {
  @ApiProperty({ example: 1, description: "User ID" })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 1200, description: "Accumulated loyalty points" })
  @IsNumber()
  @IsNotEmpty()
  points: number;

  @ApiProperty({ enum: LoyaltyLevel, example: LoyaltyLevel.Silver, description: "Loyalty program level" })
  @IsEnum(LoyaltyLevel)
  @IsNotEmpty()
  level: LoyaltyLevel;
}

import { IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSeatDto {
  @ApiProperty({ example: 1, description: "Plane ID" })
  @IsNumber()
  @IsNotEmpty()
  planeId: number;

  @ApiProperty({ example: 2, description: "Class ID (e.g., Economy, Business)" })
  @IsNumber()
  @IsNotEmpty()
  classId: number;

  @ApiProperty({ example: 12, description: "Seat number" })
  @IsNumber()
  @IsNotEmpty()
  seatNumber: number;
}

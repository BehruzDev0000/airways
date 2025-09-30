import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PlanesModel } from "../enums/plane.enum";

export class CreatePlaneDto {
  @ApiProperty({ example: 1, description: "Company ID" })
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  @ApiProperty({ enum: PlanesModel, example: PlanesModel.Boeing737, description: "Plane model" })
  @IsEnum(PlanesModel)
  @IsNotEmpty()
  model: PlanesModel;

  @ApiProperty({ example: 180, description: "Passenger capacity" })
  @IsNumber()
  @IsNotEmpty()
  capacity: number;
}

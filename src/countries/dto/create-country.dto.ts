import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Citizenship } from "src/enums/citizenship.enum";

export class CreateCountryDto {
  @ApiProperty({ enum: Citizenship, example: Citizenship.Uzbekistan, description: "Country citizenship" })
  @IsEnum(Citizenship)
  name: Citizenship;
}

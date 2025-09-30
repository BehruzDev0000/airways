import { IsNotEmpty, IsString, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateNewsDto {
  @ApiProperty({ default:'New Airport Opened in Samarkand',example: "New Airport Opened in Samarkand", description: "News title (max 100 characters)" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ default:'A new international airport',example: "A new international airport has been opened in Samarkand to boost tourism...", description: "Detailed news content" })
  @IsString()
  @IsNotEmpty()
  content: string;
}

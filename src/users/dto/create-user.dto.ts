import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsPassportNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Citizenship } from "src/enums/citizenship.enum";

export class CreateUserDto {
  @ApiProperty({ example: "John", description: "Enter your name" })
  @IsString()
  @IsNotEmpty()
  name: string;

   @ApiProperty({ example: "Doe", description: "Enter your surname" })
  @IsString()
  @IsNotEmpty()
  surname: string;

   @ApiProperty({ example: 18, description: "Enter your age" })
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({ example: "johndoe@example.com", description: "Enter your email address" })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "StrongPassword123!", description: "Enter your  password" })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: Citizenship, example: Citizenship.Uzbekistan, description: "User citizenship" })
  @IsEnum(Citizenship)
  @IsNotEmpty()
  citizenship: Citizenship;

  @ApiProperty({ example: "AB1234567", description: "Passport number" })
  @IsString()
  @IsNotEmpty()
  passportNumber: string;
}

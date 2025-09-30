import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { AdminRole } from "../enums/admin.enum";

export class CreateAdminDto {
  @ApiProperty({ example: "John Doe", description: "Admin full name" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "johndoe", description: "Unique username" })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: "+998901234567", description: "Phone number" })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: "admin@example.com", description: "Email address" })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "strongPassword123", description: "Password" })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: AdminRole,example:AdminRole.ADMIN, description: "Admin role" })
  @IsEnum(AdminRole)
  @IsString()
  @IsNotEmpty()
  role: AdminRole;
}

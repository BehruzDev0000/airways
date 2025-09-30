import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { WorkerRole } from "../enum/worker.enum";
import { Citizenship } from "src/enums/citizenship.enum";

export class CreateWorkerDto {
  @ApiProperty({ example: "Alice Johnson", description: "Full name of the worker" })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: "alice@example.com", description: "Worker email address" })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "SecurePass123!", description: "Worker password" })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: WorkerRole, example: WorkerRole.SECURITY_STAFF, description: "Worker role" })
  @IsEnum(WorkerRole)
  @IsNotEmpty()
  role: WorkerRole;

  @ApiProperty({ enum: Citizenship, example: Citizenship.Uzbekistan, description: "Worker citizenship" })
  @IsEnum(Citizenship)
  @IsNotEmpty()
  citizenship: Citizenship;
}

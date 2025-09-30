import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateBalanceDto {
    @ApiProperty({example:1000,description:'Money to update balance'})
    @IsNumber()
    @IsNotEmpty()
    money: number;
}

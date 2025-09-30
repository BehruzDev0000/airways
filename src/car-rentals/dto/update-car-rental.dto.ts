import { PartialType } from '@nestjs/swagger';
import { CreateCarRentalDto } from './create-car-rental.dto';

export class UpdateCarRentalDto extends PartialType(CreateCarRentalDto) {}

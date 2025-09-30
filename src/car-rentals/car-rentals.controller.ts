import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CarRentalsService } from './car-rentals.service';
import { CreateCarRentalDto } from './dto/create-car-rental.dto';
import { UpdateCarRentalDto } from './dto/update-car-rental.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('car-rentals')
export class CarRentalsController {
  constructor(private readonly carRentalsService: CarRentalsService) {}
  @ApiOperation({ summary: 'Create' })
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin')
  create(@Body() createCarRentalDto: CreateCarRentalDto) {
    return this.carRentalsService.create(createCarRentalDto);
  }
  @ApiOperation({ summary: 'Get all' })
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin','worker','user')
  findAll() {
    return this.carRentalsService.findAll();
  }
  @ApiOperation({ summary: 'Get by ID' })
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin','worker','user')
  findOne(@Param('id') id: string) {
    return this.carRentalsService.findOne(+id);
  }
  @ApiOperation({ summary: 'Update by ID' })
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin')
  update(@Param('id') id: string, @Body() updateCarRentalDto: UpdateCarRentalDto) {
    return this.carRentalsService.update(+id, updateCarRentalDto);
  }
  @ApiOperation({ summary: 'Delete by ID' })
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin')
  remove(@Param('id') id: string) {
    return this.carRentalsService.remove(+id);
  }
}


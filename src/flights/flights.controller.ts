import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @ApiOperation({ summary: 'Create flight' })
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin')
  create(@Body() createFlightDto: CreateFlightDto) {
    return this.flightsService.create(createFlightDto);
  }

  @ApiOperation({ summary: 'Get all flights' })
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin','worker','user')
  findAll() {
    return this.flightsService.findAll();
  }

  @Get('search')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin','worker','user')
  @ApiOperation({ summary: 'Search flights (ID/CODE + date or start/end)' })
  @ApiQuery({ name: 'departureAirport', required: true, description: 'Airport ID or CODE' })
  @ApiQuery({ name: 'arrivalAirport', required: true, description: 'Airport ID or CODE' })
  @ApiQuery({ name: 'date', required: false, description: 'YYYY-MM-DD (UTC day)' })
  @ApiQuery({ name: 'start', required: false, description: 'ISO start datetime' })
  @ApiQuery({ name: 'end', required: false, description: 'ISO end datetime' })
  search(
    @Query('departureAirport') departure: string,
    @Query('arrivalAirport') arrival: string,
    @Query('date') date?: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.flightsService.search(departure, arrival, date, start, end);
  }

  @ApiOperation({ summary: 'Get flight by ID' })
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin','worker','user')
  findOne(@Param('id') id: string) {
    return this.flightsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update flight' })
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin')
  update(@Param('id') id: string, @Body() updateFlightDto: UpdateFlightDto) {
    return this.flightsService.update(+id, updateFlightDto);
  }

  @ApiOperation({ summary: 'Delete flight' })
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin')
  remove(@Param('id') id: string) {
    return this.flightsService.remove(+id);
  }
}

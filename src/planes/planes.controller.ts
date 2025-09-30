import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PlanesService } from './planes.service';
import { CreatePlaneDto } from './dto/create-plane.dto';
import { UpdatePlaneDto } from './dto/update-plane.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('planes')
export class PlanesController {
  constructor(private readonly planesService: PlanesService) {}
  @ApiOperation({ summary: 'Create' })
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin')
  create(@Body() createPlaneDto: CreatePlaneDto) {
    return this.planesService.create(createPlaneDto);
  }
  @ApiOperation({ summary: 'Get all' })
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin','worker','user')
  findAll() {
    return this.planesService.findAll();
  }
  @ApiOperation({ summary: 'Get by ID' })
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin','worker','user')
  findOne(@Param('id') id: string) {
    return this.planesService.findOne(+id);
  }
  @ApiOperation({ summary: 'Update by ID' })
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin')
  update(@Param('id') id: string, @Body() updatePlaneDto: UpdatePlaneDto) {
    return this.planesService.update(+id, updatePlaneDto);
  }
  @ApiOperation({ summary: 'Delete by ID' })
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin')
  remove(@Param('id') id: string) {
    return this.planesService.remove(+id);
  }
}


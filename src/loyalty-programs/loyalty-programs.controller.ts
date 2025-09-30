import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LoyaltyProgramsService } from './loyalty-programs.service';
import { CreateLoyaltyProgramDto } from './dto/create-loyalty-program.dto';
import { UpdateLoyaltyProgramDto } from './dto/update-loyalty-program.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('loyalty-programs')
export class LoyaltyProgramsController {
  constructor(private readonly loyaltyProgramsService: LoyaltyProgramsService) {}
  @ApiOperation({ summary: 'Create' })
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin')
  create(@Body() createLoyaltyProgramDto: CreateLoyaltyProgramDto) {
    return this.loyaltyProgramsService.create(createLoyaltyProgramDto);
  }
  @ApiOperation({ summary: 'Get all' })
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin','worker','user')
  findAll() {
    return this.loyaltyProgramsService.findAll();
  }
  @ApiOperation({ summary: 'Get by ID' })
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin','worker','user')
  findOne(@Param('id') id: string) {
    return this.loyaltyProgramsService.findOne(+id);
  }
  @ApiOperation({ summary: 'Update by ID' })
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin')
  update(@Param('id') id: string, @Body() updateLoyaltyProgramDto: UpdateLoyaltyProgramDto) {
    return this.loyaltyProgramsService.update(+id, updateLoyaltyProgramDto);
  }
  @ApiOperation({ summary: 'Delete by ID' })
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','superadmin')
  remove(@Param('id') id: string) {
    return this.loyaltyProgramsService.remove(+id);
  }
}


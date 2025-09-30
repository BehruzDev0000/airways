import { Module } from '@nestjs/common';
import { PlanesService } from './planes.service';
import { PlanesController } from './planes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Plane } from './entities/plane.entity';
import { Company } from 'src/companies/entities/company.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[SequelizeModule.forFeature([Plane,Company]),AuthModule],
  controllers: [PlanesController],
  providers: [PlanesService],
  exports:[PlanesService]
})
export class PlanesModule {}

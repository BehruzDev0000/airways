import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Company } from './entities/company.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[SequelizeModule.forFeature([Company]),AuthModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports:[CompaniesService]
})
export class CompaniesModule {}

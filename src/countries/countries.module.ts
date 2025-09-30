import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Country } from './entities/country.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[SequelizeModule.forFeature([Country]),AuthModule],
  controllers: [CountriesController],
  providers: [CountriesService],
  exports:[CountriesService]
})
export class CountriesModule {}

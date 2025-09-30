import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Class } from './entities/class.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[SequelizeModule.forFeature([Class]),AuthModule],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports:[ClassesService]
})
export class ClassesModule {}

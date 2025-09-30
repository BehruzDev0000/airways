import { Module } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Worker } from './entities/worker.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Worker]), AuthModule],
  controllers: [WorkersController],
  providers: [WorkersService],
})
export class WorkersModule {}
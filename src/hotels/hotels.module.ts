import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Hotel } from './entities/hotel.entity';
import { User } from 'src/users/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[SequelizeModule.forFeature([Hotel,User]),AuthModule],
  controllers: [HotelsController],
  providers: [HotelsService],
  exports:[HotelsService]
})
export class HotelsModule {}

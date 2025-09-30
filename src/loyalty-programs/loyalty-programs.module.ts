import { Module } from '@nestjs/common';
import { LoyaltyProgramsService } from './loyalty-programs.service';
import { LoyaltyProgramsController } from './loyalty-programs.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import { LoyaltyProgram } from './entities/loyalty-program.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[SequelizeModule.forFeature([User,LoyaltyProgram]),AuthModule],
  controllers: [LoyaltyProgramsController],
  providers: [LoyaltyProgramsService],
})
export class LoyaltyProgramsModule {}

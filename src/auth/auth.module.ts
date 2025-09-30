import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Admin } from 'src/admins/entities/admin.entity';
import { User } from 'src/users/entities/user.entity';
import { Worker } from 'src/workers/entities/worker.entity';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [SequelizeModule.forFeature([Admin, User, Worker])],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, JwtAuthGuard, RolesGuard],
  exports:[AuthService, AuthGuard, JwtAuthGuard, RolesGuard]
})
export class AuthModule {}

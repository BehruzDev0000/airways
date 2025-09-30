import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from 'src/admins/entities/admin.entity';
import { CreateAdminDto } from 'src/admins/dto/create-admin.dto';
import { AdminRole } from 'src/admins/enums/admin.enum';
import { handleError } from 'src/utils/handle-error';
import { successResponse } from 'src/utils/success.response';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Worker } from 'src/workers/entities/worker.entity';
import { CreateWorkerDto } from 'src/workers/dto/create-worker.dto';
import { LoginDto } from './dto/login.dto';
import { AuthPrincipal } from './auth.store';
import { Role } from './enums/role.enum';
import { signJwt, verifyJwt } from './jwt.util';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';

const hashPassword = async (password: string) => {
  const saltRounds = Number(process.env.PASSWORD_SALT_ROUNDS || 10);
  return bcrypt.hash(password, saltRounds);
};

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin) private readonly adminModel: typeof Admin,
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Worker) private readonly workerModel: typeof Worker,
  ) {}

  async registerAdmin(dto: CreateAdminDto) {
    try {
      if (dto.role === AdminRole.SUPER_ADMIN) {
        const existing = await this.adminModel.findOne({
          where: { role: AdminRole.SUPER_ADMIN },
        });
        if (existing) {
          throw new ConflictException('Superadmin already exists');
        }
        throw new ConflictException(
          'Registering SUPER_ADMIN via API is not allowed',
        );
      }

      const email = await this.adminModel.findOne({ where: { email: dto.email } });
      if (email) throw new ConflictException('Email already registired');

      const username = await this.adminModel.findOne({ where: { username: dto.username } });
      if (username) throw new ConflictException('Username already exists');

      const admin = await this.adminModel.create({
        ...dto,
        password: await hashPassword(dto.password),
      });
      return successResponse(admin, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async registerUser(dto: CreateUserDto) {
    try {
      const passport = await this.userModel.findOne({
        where: { passport_number: dto.passportNumber },
      });
      if (passport) throw new ConflictException('Passport number already exists');

      const email = await this.userModel.findOne({ where: { email: dto.email } });
      if (email) throw new ConflictException('Email already exists');

      const user = await this.userModel.create({
        ...dto,
        password: await hashPassword(dto.password),
      });
      return successResponse(user, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async registerWorker(dto: CreateWorkerDto) {
    try {
      const email = await this.workerModel.findOne({ where: { email: dto.email } });
      if (email) throw new ConflictException('This email already registired');

      const worker = await this.workerModel.create({
        ...dto,
        password: await hashPassword(dto.password),
      });
      return successResponse(worker, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async login(dto: LoginDto, res: Response) {
    try {
      const { email, password } = dto;
      const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
      const refreshSecret = process.env.JWT_REFRESH_SECRET || secret;
      // Treat env values as DAYS, convert to seconds for JWT and ms for cookies
      const accessDays = Number(process.env.JWT_ACCESS_EXPIRES || 1);
      const refreshDays = Number(process.env.JWT_REFRESH_EXPIRES || 30);
      const accessExpires = accessDays * 24 * 60 * 60; // seconds
      const refreshExpires = refreshDays * 24 * 60 * 60; // seconds

      const admin = await this.adminModel.findOne({ where: { email } });
      if (admin) {
        const valid = await bcrypt.compare(password, admin.password);
        if (!valid) throw new UnauthorizedException('Invalid credentials');
        const principal: AuthPrincipal = {
          id: admin.id,
          email: admin.email,
          role: admin.role as Role,
          type: 'admin',
        };
        const accessToken = signJwt(
          { sub: principal.id, email: principal.email, role: principal.role, type: principal.type, token: 'access' },
          secret,
          accessExpires,
        );
        const refreshToken = signJwt(
          { sub: principal.id, email: principal.email, role: principal.role, type: principal.type, token: 'refresh' },
          refreshSecret,
          refreshExpires,
        );
        res.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: refreshExpires * 1000,
          path: '/',
        });
        return { data: { accessToken, principal } };
      }

      const worker = await this.workerModel.findOne({ where: { email } });
      if (worker) {
        const valid = await bcrypt.compare(password, worker.password);
        if (!valid) throw new UnauthorizedException('Invalid credentials');
        const principal: AuthPrincipal = {
          id: worker.id,
          email: worker.email,
          role: 'worker',
          type: 'worker',
        };
        const accessToken = signJwt(
          { sub: principal.id, email: principal.email, role: principal.role, type: principal.type, token: 'access' },
          secret,
          accessExpires,
        );
        const refreshToken = signJwt(
          { sub: principal.id, email: principal.email, role: principal.role, type: principal.type, token: 'refresh' },
          refreshSecret,
          refreshExpires,
        );
        res.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: refreshExpires * 1000,
          path: '/',
        });
        return { data: { accessToken, principal } };
      }

      const user = await this.userModel.findOne({ where: { email } });
      if (user) {
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new UnauthorizedException('Invalid credentials');
        const principal: AuthPrincipal = {
          id: user.id,
          email: user.email,
          role: 'user',
          type: 'user',
        };
        const accessToken = signJwt(
          { sub: principal.id, email: principal.email, role: principal.role, type: principal.type, token: 'access' },
          secret,
          accessExpires,
        );
        const refreshToken = signJwt(
          { sub: principal.id, email: principal.email, role: principal.role, type: principal.type, token: 'refresh' },
          refreshSecret,
          refreshExpires,
        );
        res.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: refreshExpires * 1000,
          path: '/',
        });
        return { data: { accessToken, principal } };
      }

      throw new NotFoundException('Account not found');
    } catch (error) {
      handleError(error);
    }
  }

  async refresh(refreshToken: string, res: Response) {
    const secret =
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev_secret_change_me';
    const accessSecret = process.env.JWT_SECRET || 'dev_secret_change_me';
    // Treat env values as DAYS, convert to seconds for JWT and ms for cookies
    const accessDays = Number(process.env.JWT_ACCESS_EXPIRES || 1);
    const refreshDays = Number(process.env.JWT_REFRESH_EXPIRES || 30);
    const accessExpires = accessDays * 24 * 60 * 60; // seconds
    const refreshExpires = refreshDays * 24 * 60 * 60; // seconds

    try {
      const claims = verifyJwt(refreshToken, secret);
      if ((claims as any).token !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const principal = {
        id: claims.sub,
        email: claims.email,
        role: claims.role,
        type: claims.type,
      };

      const accessToken = signJwt(
        {
          sub: principal.id,
          email: principal.email,
          role: principal.role,
          type: principal.type,
          token: 'access',
        },
        accessSecret,
        accessExpires,
      );

      const newRefreshToken = signJwt(
        {
          sub: principal.id,
          email: principal.email,
          role: principal.role,
          type: principal.type,
          token: 'refresh',
        },
        secret,
        refreshExpires,
      );

      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: refreshExpires * 1000,
        path: '/',
      });

      return { data: { accessToken, principal } };
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}

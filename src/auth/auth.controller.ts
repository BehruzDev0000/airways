import { Body, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAdminDto } from 'src/admins/dto/create-admin.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateWorkerDto } from 'src/workers/dto/create-worker.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Auth } from './decorators/auth.decorator';
import type { Request, Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/register')
  @Auth('superadmin')
  @ApiOperation({ summary: 'Create admin (superadmin only)' })
  registerAdmin(@Body() dto: CreateAdminDto) {
    return this.authService.registerAdmin(dto);
  }

  @Post('user/register')
  @ApiOperation({ summary: 'Register user' })
  registerUser(@Body() dto: CreateUserDto) {
    return this.authService.registerUser(dto);
  }

  @Post('worker/register')
  @Auth('admin', 'superadmin')
  @ApiOperation({ summary: 'Create worker (admin/superadmin only)' })
  registerWorker(@Body() dto: CreateWorkerDto) {
    return this.authService.registerWorker(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and set refresh cookie' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.['refresh_token'];
    if (!refreshToken) throw new UnauthorizedException('Refresh token missing');
    return this.authService.refresh(refreshToken, res);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Clear refresh cookie (logout)' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return { message: 'Logged out successfully' };
  }
}


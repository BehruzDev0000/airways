import { ConflictException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from 'src/admins/entities/admin.entity';
import { CreateAdminDto } from 'src/admins/dto/create-admin.dto';
import { AdminRole } from 'src/admins/enums/admin.enum';
import { handleError } from 'src/utils/handle-error';
import { successResponse } from 'src/utils/success.response';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcryptjs';

const hashPassword = async (password: string) => {
  const saltRounds = Number(process.env.PASSWORD_SALT_ROUNDS || 10);
  return bcrypt.hash(password, saltRounds);
};

@Injectable()
export class AdminsService implements OnModuleInit {
  constructor(
    @InjectModel(Admin) private readonly adminModel: typeof Admin,
  ) {}

  async onModuleInit() {
    try {
      const existingSuper = await this.adminModel.findOne({ where: { role: AdminRole.SUPER_ADMIN } });
      if (existingSuper) return;

      const name = process.env.SUPERADMIN_NAME || 'Super Admin';
      const username = process.env.SUPERADMIN_USERNAME || 'superadmin';
      const phone = process.env.SUPERADMIN_PHONE || '+998970978397';
      const email = process.env.SUPERADMIN_EMAIL || '';
      const password = process.env.SUPERADMIN_PASSWORD || '';
      if (!email || !password) {
        console.warn('[AdminsService] SUPERADMIN_EMAIL or SUPERADMIN_PASSWORD is missing; skip seeding.');
        return;
      }

      const emailExists = await this.adminModel.findOne({ where: { email } });
      if (emailExists) return;

      const usernameExists = await this.adminModel.findOne({ where: { username } });
      const finalUsername = usernameExists ? `${username}_${Date.now()}` : username;

      const hashed = await hashPassword(password);
      await this.adminModel.create({
        name,
        username: finalUsername,
        phone,
        email,
        password: hashed,
        role: AdminRole.SUPER_ADMIN,
      });
      console.log('[AdminsService] Superadmin user has been seeded.');
    } catch (e) {
      console.error('[AdminsService] Failed to seed superadmin:', (e as Error).message);
    }
  }

  async create(dto: CreateAdminDto) {
    try {
      if (dto.role === AdminRole.SUPER_ADMIN) {
        const existing = await this.adminModel.findOne({
          where: { role: AdminRole.SUPER_ADMIN },
        });
        if (existing) throw new ConflictException('Superadmin already exists');
        throw new ConflictException('Registering SUPER_ADMIN via API is not allowed');
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

  async findAll() {
    try {
      const admins = await this.adminModel.findAll();
      return successResponse(admins);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const admin = await this.adminModel.findOne({ where: { id } });
      if (!admin) throw new NotFoundException('Admin not found');
      return successResponse(admin);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, dto: UpdateAdminDto) {
    try {
      const admin = await this.adminModel.findOne({ where: { id } });
      if (!admin) throw new NotFoundException('Admin not found');

      if (dto.role === AdminRole.SUPER_ADMIN) {
        throw new ConflictException('Updating to SUPER_ADMIN is not allowed');
      }

      if (dto.email) {
        const email = await this.adminModel.findOne({ where: { email: dto.email } });
        if (email && email.id !== id) {
          throw new ConflictException('Email already registired');
        }
      }

      if (dto.username) {
        const username = await this.adminModel.findOne({ where: { username: dto.username } });
        if (username && username.id !== id) {
          throw new ConflictException('Username already exists');
        }
      }

      const payload: any = { ...dto };
      if (dto.password) {
        payload.password = await hashPassword(dto.password);
      }

      const [, [updated]] = await this.adminModel.update(payload, {
        where: { id },
        returning: true,
      });
      return successResponse(updated);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const admin = await this.adminModel.findOne({ where: { id } });
      if (!admin) throw new NotFoundException('Admin not found');
      if (admin.role === AdminRole.SUPER_ADMIN) {
        throw new ConflictException('Deleting SUPER_ADMIN is not allowed');
      }
      await this.adminModel.destroy({ where: { id } });
      return successResponse({ message: 'Admin deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}

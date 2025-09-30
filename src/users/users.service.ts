import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { handleError } from 'src/utils/handle-error';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { successResponse } from 'src/utils/success.response';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel:typeof User,
    private readonly transactionsService: TransactionsService,
  ) {}

  async findAll() {
    try {
      const users=await this.userModel.findAll({include:{all:true}})
      return successResponse(users)
    } catch (error) {
      handleError(error)
    }
  }

  async findOne(id: number) {
    try {
      const user=await this.userModel.findOne({where:{id}})
      if(!user){
        throw new NotFoundException('User not found')
      }
      return successResponse(user)
    } catch (error) {
      handleError(error)
    }
  }

 async update(id: number, updateUserDto: UpdateUserDto) {
  try {
    const user = await this.userModel.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.passportNumber) {
      const passport = await this.userModel.findOne({ where: { passport_number: updateUserDto.passportNumber } });
      if (passport && passport.id !== id) {
        throw new ConflictException('Passport number already exists');
      }
    }

    if (updateUserDto.email) {
      const email = await this.userModel.findOne({ where: { email: updateUserDto.email } });
      if (email && email.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }
    const [, [updatedUser]] = await this.userModel.update(updateUserDto, {
      where: { id },
      returning: true
    });

    return successResponse(updatedUser);
  } catch (error) {
    handleError(error);
  }
}

  async updateBalance(id:number,money:number){
    try {
      const amount = Number(money);
      if (Number.isNaN(amount) || amount <= 0) {
        throw new BadRequestException('Top-up amount must be greater than zero');
      }
      const user=await this.userModel.findOne({where:{id}});
      if(!user){
        throw new NotFoundException('User not found');
      }
      const currentBalance = Number(user.balance) || 0;
      const newBalance = currentBalance + amount;
      await user.update({ balance: newBalance });
      await this.transactionsService.recordTransaction({
        userId: id,
        amount,
        type: 'topup',
        description: 'User balance top-up',
      });
      return successResponse({message:'Balance updated successfully', balance: newBalance});
    } catch (error) {
      handleError(error);
    }
  }

  async findTransactions(id: number) {
    try {
      const user = await this.userModel.findOne({ where: { id } });
      if (!user) throw new NotFoundException('User not found');
      const items = await this.transactionsService.findByUser(id);
      return successResponse(items);
    } catch (error) {
      handleError(error);
    }
  }
  async remove(id: number) {
    try {
      const user=await this.userModel.findOne({where:{id}})
      if(!user){
        throw new NotFoundException('User not found')
      }
      const affected = await this.userModel.destroy({where:{id}})
      return successResponse({message:'Deleted successfully', affected})
    } catch (error) {
      handleError(error)
    }
  }
}





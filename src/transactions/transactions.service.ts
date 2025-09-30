import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from './entities/transaction.entity';

interface RecordTransactionOptions {
  userId: number;
  amount: number;
  type: string;
  description?: string;
  createdAt?: Date;
}

@Injectable()
export class TransactionsService {
  constructor(@InjectModel(Transaction) private readonly transactionModel: typeof Transaction) {}

  async recordTransaction(options: RecordTransactionOptions) {
    const { userId, amount, type, description, createdAt } = options;
    return this.transactionModel.create({
      userId,
      amount,
      type,
      description,
      createdAt: createdAt ?? new Date(),
    });
  }

  async findByUser(userId: number) {
    return this.transactionModel.findAll({
      where: { userId },
      order: [['created_at', 'DESC']],
    });
  }
}


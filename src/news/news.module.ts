import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { News } from './entities/news.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[SequelizeModule.forFeature([News]),AuthModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}

import { News, NewsSchema } from './schema/news.shema';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: News.name, schema: NewsSchema }
    ]),
    PassportModule.register({ defaultStrategy: 'jwt '}),
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}

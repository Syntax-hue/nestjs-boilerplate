import { CrudService } from './../core/crud/crud.service';
import { Model } from 'mongoose';
import { News } from './schema/news.shema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NewsService extends CrudService<News> {
  constructor(@InjectModel(News.name) private readonly newsModel: Model<News>) {
    super(newsModel)
  }
}

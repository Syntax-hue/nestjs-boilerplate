import { Model } from 'mongoose';
import { News } from './schema/news.shema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class NewsService {

  constructor(@InjectModel(News.name) private readonly newsModel: Model<News> ) { }

  public async getAll() {
    try {
      return this.newsModel.find();
    } catch (e) {
      throw new HttpException(e.message, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getOne(id) {
    try {
      const news = await this.newsModel.findOne({ _id: id});
      
      if (!news) return new ForbiddenException();
      return news;
    } catch (e) {
      throw new HttpException(e.message, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async create(dto) {
    return 'create'
  }

  public async update(id, dto) {
    return 'update';
  }

  public async remove(id) {
    return 'remove';
  }
}

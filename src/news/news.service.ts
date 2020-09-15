import { Injectable } from '@nestjs/common';

@Injectable()
export class NewsService {

  getAll() {
    return 'getting all news'
  }

  public async getOne(id) {
    return 'get one'
  }

  async create(dto) {
    return 'create'
  }

  public async update(id, dto) {
    return 'update';
  }

  async remove(id) {
    return 'remove';
  }
}

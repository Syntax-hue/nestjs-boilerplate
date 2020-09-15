import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {

    constructor(private readonly newsService: NewsService) { }

    @Get()
    async getAll() {
        return this.newsService.getAll();
    }

    @Get(':id')
    async getOne(
        @Param('id') id: string
    ) {
        return this.newsService.getOne(id);
    }

    @Post()
    async createPost(
        @Body() createNewsDto: any
    ) {
        return this.newsService.create(createNewsDto);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateNewsDto: any,
    ) {
        return this.newsService.update(id, updateNewsDto);
    }

    @Delete(':id')
    async remove(
        @Param('id') id: string,
    ) {
        return this.newsService.remove(id);
    }
}

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UseRoles } from 'nest-access-control';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {

    constructor(private readonly newsService: NewsService) { }

    public resource = 'news';

    @Get()
    async getAll() {
        return this.newsService.getAll();
    }

    @Get(':id')
    async getOne(
        @Param('id') id: string
    ) {
        return this.newsService.get(id);
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
        return this.newsService.update(id, updateNewsDto, { new: true });
    }

    @Delete(':id')
    async remove(
        @Param('id') id: string,
    ) {
        return this.newsService.deleteOne(id);
    }
}

import { UpdateNewsDto } from './dto/update-news.dto';
import { CreateNewsDto } from './dto/create-news.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './schema/news.shema';

@Controller('news')
export class NewsController {

    constructor(private readonly newsService: NewsService) { }

    public resource = 'news';

    @Get()
    async getAll(): Promise<News[]> {
        return this.newsService.getAll();
    }

    @Get(':id')
    async getOne(
        @Param('id') id: string
    ): Promise<News> {
        return this.newsService.get({_id: id});
    }

    @Post()
    async createPost(
        @Body() createNewsDto: CreateNewsDto
    ): Promise<News> {
        return this.newsService.create(createNewsDto);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateNewsDto: UpdateNewsDto,
    ): Promise<Partial<News>> {
        return this.newsService.update(id, updateNewsDto, { new: true });
    }

    @Delete(':id')
    async remove(
        @Param('id') id: string,
    ): Promise<void> {
        return this.newsService.deleteOne({_id: id});
    }
}

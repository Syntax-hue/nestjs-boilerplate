import { User } from './../users/schema/user.schema';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CreateNewsDto } from './dto/create-news.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './schema/news.shema';
import { UserData } from 'src/core/decorators';
import { AuthGuard } from '@nestjs/passport';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService,
        @InjectRolesBuilder() private readonly rolesBuilder: RolesBuilder 
        ) { }

    public resource = 'news';

    @Get()
    async getAll(): Promise<News[]> {
        return this.newsService.getAll();
    }

    @Get(':id')
    async getOne(
        @Param('id') id: string
    ): Promise<News> {
        return this.newsService.get({ _id: id });
    }

    @UseGuards(AuthGuard)
    @Post()
    async createPost(
        @Body() createNewsDto: CreateNewsDto,
        @UserData() user: User
    ): Promise<News> {
        return this.newsService.create(createNewsDto, {
            permission: this.rolesBuilder.can(user.roles),
            resource: this.resource,
            userId: user.id
        });
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateNewsDto: UpdateNewsDto,
        @UserData() user: User
    ): Promise<Partial<News>> {
        return this.newsService.update(id, updateNewsDto, { new: true }, {
            permission: this.rolesBuilder.can(user.roles),
            resource: this.resource,
            userId: user.id,
            ownershipField: '_id'
        });
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async remove(
        @Param('id') id: string,
        @UserData() user: User
    ): Promise<void> {
        return this.newsService.deleteOne({ _id: id }, {
            permission: this.rolesBuilder.can(user.roles),
            resource: this.resource,
            userId: user.id,
            ownershipField: '_id'
        });
    }
}

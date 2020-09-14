import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { CreateDictionaryDto, FindDictionaryDto, UpdateKeyDto } from './dto/dictionary.dto';
import { Dictionary } from './schema/dictionary.schema';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { ResponseSuccess } from '../core/utils';
import { UserData } from 'src/core/decorators';
import { User } from 'src/users/schema/user.schema';

@ApiTags('Dictionary') /* Swagger * */
@Controller('dictionary')
export class DictionaryController {
  constructor(
    private readonly dictionaryService: DictionaryService
  ) { }


  /* Swagger * */
  @ApiResponse({ type: Dictionary, isArray: true })
  @ApiOperation({ summary: 'Get the dictionary' })
  /* * * * * */
  @UseGuards(AuthGuard)
  @Get()
  public async getAll(
    @UserData() user: User,
    @Headers('user-language') userLanguage: string
  ): Promise<Dictionary[]> {
    return await this.dictionaryService.getAllWordKeys(userLanguage);
  }

  /* Swagger * */
  @ApiResponse({ type: Dictionary, isArray: true })
  @ApiOperation({ summary: 'Get the dictionary' })
  /* * * * * */
  @Get('for-client')
  public async getAllForClient(
    @Headers('user-language') userLanguage: string
  ): Promise<Record<string, string>> {
    return await this.dictionaryService.getAllWordKeys(userLanguage, true);
  }

  /* Swagger * */
  @ApiResponse({ type: Dictionary })
  @ApiOperation({ summary: 'Get the dictionary' })
  // @ApiBearerAuth()
  /* * * * * */
  @UseGuards(AuthGuard)
  @Post('add')
  async addKey(
    @Body() dictionaryDto: CreateDictionaryDto
  ): Promise<Dictionary> {
    return await this.dictionaryService.addKeysDictionary(dictionaryDto);
  }

  /* Swagger * */
  @ApiResponse({ type: Dictionary })
  @ApiOperation({ summary: 'Find a key in the dictionary' })
  // @ApiBearerAuth()
  /* * * * * */
  @UseGuards(AuthGuard)
  @Post('find')
  public async getById(
    @Body() dictionaryGetDto: FindDictionaryDto
  ): Promise<Dictionary> {
    return await this.dictionaryService.getByKey(dictionaryGetDto.wordKey);
  }

  /* Swagger * */
  @ApiResponse({ type: Dictionary })
  @ApiOperation({ summary: 'Filter for a key in the dictionary' })
  // @ApiBearerAuth()
  /* * * * * */
  @UseGuards(AuthGuard)
  @Get('filter/:value')
  public async filter(
    @Param('value') value: string
  ): Promise<Dictionary[]> {
    return await this.dictionaryService.filter(value);
  }


  /* Swagger * */
  @ApiOperation({ summary: 'Update a key from the dictionary' })
  @ApiBearerAuth()
  /* * * * * */
  @UseGuards(AuthGuard)
  @Patch(':wordKey')
  public async udpate(
    @Param('wordKey') wordKey: string,
    @Body() updateKeyDto: UpdateKeyDto,
  ): Promise<any> {
    return await this.dictionaryService.update(wordKey, updateKeyDto)
  }

  /* Swagger * */
  @ApiOperation({ summary: 'Delete a key from the dictionary' })
  @ApiBearerAuth()
  /* * * * * */
  @UseGuards(AuthGuard)
  @Delete(':wordKey')
  public async delete(
    @Param('wordKey') wordKey: string
  ): Promise<any> {
    await this.dictionaryService.deleteKey(wordKey)
    return new ResponseSuccess('KEY_DELETED_SUCCESSFULLY');
  }

}


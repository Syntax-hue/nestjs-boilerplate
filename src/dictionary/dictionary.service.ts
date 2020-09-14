import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { Dictionary } from './schema/dictionary.schema';
import { mapLanguageObjectToProps } from '../core/utils';
import { UpdateKeyDto } from './dto/dictionary.dto';
import { IRoleDetails } from 'src/core/crud/crud.service';


@Injectable()
export class DictionaryService {
  constructor(
    @InjectModel('dictionary') private dictionaryModel: Model<Dictionary>
  ) { }

  public async getAllWordKeys(
    userLanguage = null,
    forClient = false,
    roleDetails: IRoleDetails
  ): Promise<Dictionary[] | any> {
    try {
      let keys = await this.dictionaryModel.find();
      keys = keys.map(keyObj => mapLanguageObjectToProps(userLanguage, keyObj))
      if (forClient) {
        return keys.reduce((map, obj) => {
          map[obj.wordKey] = obj.value;
          return map;
        }, {})
      }
      return keys;
    } catch (e) {
      throw new HttpException(e.message, e.status || HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  public async addKeysDictionary(pages: any): Promise<Dictionary> {
    try {
      const createPage = new this.dictionaryModel(pages);
      return await createPage.save();
    } catch (e) {
      if (e.name === 'MongoError' && e.code === 11000) {
        throw new BadRequestException('Dictionary key already exists in the database')
      }
      throw new HttpException(e.message, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async update(wordKey, updateKeyDto: UpdateKeyDto): Promise<Dictionary> {
    try {
      return await this.dictionaryModel.findOneAndUpdate({ wordKey }, updateKeyDto, { new: true })
    } catch (e) {
      throw new HttpException(e.message, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getByKey(wordKey): Promise<Dictionary> {
    try {
      const wordKeys = await this.dictionaryModel.findOne({ wordKey });
      return wordKeys;
    } catch (e) {
      throw new HttpException(e.message, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async filter(value: string): Promise<Dictionary[]> {
    try {
      const result = await this.dictionaryModel.aggregate([{
        $match: {
          $or: [
            { wordKey: { $regex: new RegExp(value, 'i') } },
            { value: { $regex: new RegExp(value, 'i') } }
          ]
        }
      }]);
      return result;
    } catch (e) {
      throw new HttpException(e.message, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  public async deleteKey(wordKey: string): Promise<void> {
    try {
      await this.dictionaryModel.deleteOne({ wordKey })
    } catch (e) {
      throw new HttpException(e.message, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}

import { HttpModule, Module } from '@nestjs/common';
import { DictionaryController } from './dictionary.controller';
import { DictionaryService } from './dictionary.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DictionarySchema } from './schema/dictionary.schema';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'dictionary', schema: DictionarySchema }]),
    HttpModule,
    PassportModule.register({defaultStrategy: 'jwt'})
  ],
  controllers: [DictionaryController],
  providers: [DictionaryService]
})
export class DictionaryModule {}

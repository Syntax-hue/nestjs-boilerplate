import { Global, Module } from '@nestjs/common';
import { RolesBuilderService } from './roles-builder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesSchema, Roles } from './schema/roles.schema';
import { RolesBuilderController } from './roles-builder.controller';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Roles.name,
      schema: RolesSchema
    }])
  ],
  controllers: [RolesBuilderController],
  exports: [RolesBuilderService],
  providers: [RolesBuilderService],
})
export class RolesBuilderModule { }

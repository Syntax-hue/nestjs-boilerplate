import { editFileName, imageFileFilter } from './../core/utils';
import { Controller, Get, Post, Param, UseInterceptors, UploadedFile, UploadedFiles, Res } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadFile(
    @UploadedFile() file: { originalname: string, filename: string }) {
    this.uploadService.uploadOne(file)
  }

  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  async uploadMultipleFiles(
    @UploadedFiles() files
  ) {

    this.uploadService.uploadMultiple(files);
  }

  @Get(':imgpath')
  seeUploadedFile(
    @Param('imgpath') image,
    @Res() res
  ) {
    return res.sendFile(image, { root: './files' });
  }

}

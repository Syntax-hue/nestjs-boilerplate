import { editFileName, imageFileFilter } from './../core/utils';
import { Controller, Get, Post, Param, UseInterceptors, UploadedFile, UploadedFiles, Res } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

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
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    }
    return response;
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
    const response = [];

    files.forEach(file => {
      const fileResponse = {
        originalname: file.originalname,
        filename: file.filename,
      };

      response.push(fileResponse)
    })
  }

  @Get(':imgpath')
  seeUploadedFile(
    @Param('imgpath') image,
    @Res() res
  ) {
    return res.sendFile(image, { root: './files' });
  }

}

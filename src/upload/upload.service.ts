import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  public uploadOne(file) {
    try {
      const response = {
        originalname: file.originalname,
        filename: file.filename,
      }
      return response;
    } catch (e) {
      throw new BadRequestException(e.message || e)
    }
  }

  public uploadMultiple(files) {
    try {
      const response = [];

      files.forEach(file => {
        const fileResponse = {
          originalname: file.originalname,
          filename: file.filename,
        };

        response.push(fileResponse)
      })
    } catch (e) {
      throw new BadRequestException(e.message || e)
    }
  }
}

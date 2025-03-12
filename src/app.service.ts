import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus(): { status: string; message: string; version: string } {
    return {
      status: 'ok',
      message: 'API is running',
      version: '1.0.0',
    };
  }
}

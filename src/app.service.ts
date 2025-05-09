import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /** Used by AppController GET / */
  getHello(): string {
    return 'Welcome to the Simplified Logistics Management API';
  }
}

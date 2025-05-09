import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /** GET / → welcome message */
  @Get()
  getRoot(): string {
    return this.appService.getHello();
  }

  /** GET /health → health check JSON */
  @Get('health')
  healthCheck() {
    return { status: 'ok', uptime: process.uptime() };
  }

  /** GET /docs → redirect into Swagger UI at /api‑docs */
  @Get('docs')
  redirectToDocs(@Res() res: Response) {
    return res.redirect('/api-docs');
  }
}

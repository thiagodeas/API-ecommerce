import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Endpoint principal da aplicação' })
  @ApiResponse({ status: 200, description: 'Mensagem de boas-vindas retornada com sucesso.' })
  getHello(): string {
    return this.appService.getHello();
  }
}

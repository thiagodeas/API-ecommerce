import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Endpoint principal da aplicação' })
  @ApiResponse({
    status: 200,
    description: 'Status da API e informações de versão retornados com sucesso.',
    schema: {
      example: {
        status: 'ok',
        message: 'API is running',
        version: '1.0.0',
      },
    },
  })
  getStatus() {
    return this.appService.getStatus();
  }
}

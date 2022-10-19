import { Controller, Get, Query } from '@nestjs/common';
import { Sistema } from 'src/database/entities/sistema.entity';
import { SistemaService } from 'src/services/sistema.service';



@Controller('sistema')
export class SistemaController {
  constructor(private readonly sistemaService: SistemaService) {}

  @Get('all')
  async findAll(): Promise<Sistema[]> {
    return await this.sistemaService.findAll();
  }

  @Get()
  async findOne(@Query() params): Promise<Sistema> {
    return await this.sistemaService.findOne(params.nome);
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { Complexidade } from 'src/database/entities/complexidade.entity';
import { ComplexidadeService } from 'src/services/complexidade.service';


@Controller('complexidade')
export class ComplexidadeController {
  constructor(private readonly complexidadeService: ComplexidadeService) {}

  @Get('all')
  async findAll(): Promise<Complexidade[]> {
    return await this.complexidadeService.findAll();
  }

  @Get()
  async findOne(@Query() params): Promise<Complexidade> {
    return await this.complexidadeService.findOne(params.nome);
  }
}

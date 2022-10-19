import { Controller, Get, Query } from '@nestjs/common';
import { Setor } from 'src/database/entities/setor.entity';
import { SetorService } from 'src/services/setor.service';


@Controller('setor')
export class SetorController {
  constructor(private readonly setorService: SetorService) {}

  @Get('all')
  async findAll(): Promise<Setor[]> {
    return await this.setorService.findAll();
  }

  @Get()
  async findOne(@Query() params): Promise<Setor> {
    return await this.setorService.findOne(params.nome);
  }
}

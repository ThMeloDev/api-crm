import {
  Controller,
  Get,
  Query
} from '@nestjs/common';
import { SetorEnvolvido } from 'src/database/entities/setorEnvolvido.entity';
import { SetorEnvolvidoService } from 'src/services/setorEnvolvido.service';

@Controller('setorEnvolvido')
export class SetorEnvolvidoController {
  constructor(private readonly setorEnvolvidoService: SetorEnvolvidoService) {}

  @Get()
  async findSetores(@Query() params): Promise<SetorEnvolvido[]> {
    return this.setorEnvolvidoService.findSetores(
      params.crmId,
      params.crmVersao,
    );
  }
}

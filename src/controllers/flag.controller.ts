import { Controller, Get, Query } from '@nestjs/common';
import { Flag } from 'src/database/entities/flag.entity';
import { FlagService } from 'src/services/flag.service';


@Controller('flag')
export class FlagController {
  constructor(private readonly flagService: FlagService) {}

  @Get('all')
  async findAll(): Promise<Flag[]> {
    return await this.flagService.findAll();
  }

  @Get()
  async findOne(@Query() params): Promise<Flag> {
    return await this.flagService.findOne(params.nome);
  }
}

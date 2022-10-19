import { Controller, Get, Param, Query } from '@nestjs/common';
import { Crm } from 'src/database/entities/crm.entity';
import { CrmService } from 'src/services/crm.service';



@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get('all')
  async findAll(): Promise<Crm[]> {
    return await this.crmService.findAll();
  }

  @Get()
  async findOne(@Query() params): Promise<Crm> {
    return await this.crmService.findOne(params.id,params.versao);
  }
}

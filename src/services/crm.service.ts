
import { Inject, Injectable } from '@nestjs/common';
import { Crm } from 'src/database/entities/crm.entity';
import { Repository } from 'typeorm';


@Injectable()
export class CrmService {
  constructor(
    @Inject('CRM_REPOSITORY')
    private crmReposity: Repository<Crm>,
  ) {}

  async findAll(): Promise<Crm[]> {
    return await this.crmReposity.find();
  }

  async findOne(id: number,versao:number): Promise<Crm> {
    return await this.crmReposity.findOneBy({ id,versao });
  }
  
}
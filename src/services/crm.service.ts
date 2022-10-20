
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
    return await this.crmReposity.find({
      relations: {
        complexidade: true,
        colaboradorCriador: {setor:true}
      }
    });
  }

  async findOne(id: number,versao:number): Promise<Crm[]> {
    return await this.crmReposity.find({
      where:{
        id: id,
        versao: versao
      },
      relations: {
        complexidade: true,
        colaboradorCriador: {setor:true},
        setoresEnvolvidos:true,
        sistemasEnvolvidos:true,
        documentos: true
      }
     });
  }
  
}
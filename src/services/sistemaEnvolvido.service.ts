import { Inject, Injectable } from '@nestjs/common';
import { SistemaEnvolvido } from 'src/database/entities/sistemaEnvolvido.entity';
import { Repository } from 'typeorm';


@Injectable()
export class SistemaEnvolvidoService {
  constructor(
    @Inject('SISTEMAENVOLVIDO_REPOSITORY')
    private sistemaEnvolvidoReposity: Repository<SistemaEnvolvido>,
  ) {}

  async findSistemas(crmId: number,crmVersao: number): Promise<SistemaEnvolvido[]> {
    return await this.sistemaEnvolvidoReposity.find({
      select: {sistemaNome:true},
      where: {
        crmId: crmId,
        crmVersao: crmVersao,
      }
    });
  }

  async findOne(sistemaNome: string,crmId:number,crmVersao:number): Promise<SistemaEnvolvido> {
    return await this.sistemaEnvolvidoReposity.findOneBy({ sistemaNome, crmId, crmVersao });
  }
  
}
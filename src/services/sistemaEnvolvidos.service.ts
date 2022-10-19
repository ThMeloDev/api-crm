import { Inject, Injectable } from '@nestjs/common';
import { SistemasEnvolvidos } from 'src/database/entities/sistemasEnvolvidos.entity';
import { Repository } from 'typeorm';


@Injectable()
export class SistemasEnvolvidosService {
  constructor(
    @Inject('SISTEMASENVOLVIDOS_REPOSITORY')
    private sistemasEnvolvidosReposity: Repository<SistemasEnvolvidos>,
  ) {}

  async findSistemas(crmId: number,crmVersao: number): Promise<SistemasEnvolvidos[]> {
    return await this.sistemasEnvolvidosReposity.find({
      select: {sistemaNome:true},
      where: {
        crmId: crmId,
        crmVersao: crmVersao,
      }
    });
  }

  async findOne(sistemaNome: string,crmId:number,crmVersao:number): Promise<SistemasEnvolvidos> {
    return await this.sistemasEnvolvidosReposity.findOneBy({ sistemaNome, crmId, crmVersao });
  }
  
}
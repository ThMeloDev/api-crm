import { Inject, Injectable } from '@nestjs/common';
import { SetoresEnvolvidos } from 'src/database/entities/setoresEnvolvidos.entity';
import { Repository } from 'typeorm';


@Injectable()
export class SetoresEnvolvidosService {
  constructor(
    @Inject('SETORESENVOLVIDOS_REPOSITORY')
    private setoresEnvolvidosReposity: Repository<SetoresEnvolvidos>,
  ) {}

  async findSetores(crmId: number,crmVersao: number): Promise<SetoresEnvolvidos[]> {
    return await this.setoresEnvolvidosReposity.find({
      select: {
        setorNome:true,
        flagNome:true,
        colaboradorMatricula:true,
        justificativa:true
      },
      where: {
        crmId: crmId,
        crmVersao: crmVersao,
      }
    });
  }

  async findOne(setorNome: string,crmId:number,crmVersao:number): Promise<SetoresEnvolvidos> {
    return await this.setoresEnvolvidosReposity.findOneBy({ setorNome, crmId, crmVersao });
  }
  
}
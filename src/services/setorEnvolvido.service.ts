import { Inject, Injectable } from '@nestjs/common';
import { SetorEnvolvido } from 'src/database/entities/setorEnvolvido.entity';
import { Repository } from 'typeorm';


@Injectable()
export class SetorEnvolvidoService {
  constructor(
    @Inject('SETORENVOLVIDO_REPOSITORY')
    private setorEnvolvidoReposity: Repository<SetorEnvolvido>,
  ) {}

  async findSetores(crmId: number,crmVersao: number): Promise<SetorEnvolvido[]> {
    return await this.setorEnvolvidoReposity.find({
      select: {
        setorNome:true,
        colaboradorMatricula:true,
        justificativa:true
      },
      where: {

        crmVersao: crmVersao,
      },
      relations:{
        flag: true
      }
    });
  }

  async findOne(setorNome: string,crmId:number,crmVersao:number): Promise<SetorEnvolvido> {
    return await this.setorEnvolvidoReposity.findOneBy({ setorNome, crmId, crmVersao });
  }
  
}
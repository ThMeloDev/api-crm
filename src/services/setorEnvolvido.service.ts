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
        nomeSetor:true,
        matriculaColaborador:true,
        justificativa:true
      },
      where: {
        crmId: crmId,
        crmVersao: crmVersao,
      },
      relations:{
        flag: true
      }
    });
  }
  
}
import { Inject, Injectable } from '@nestjs/common';
import { SetorEnvolvido } from 'src/database/entities/setorEnvolvido.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SetorEnvolvidoService {
  constructor(
    @Inject('SETORENVOLVIDO_REPOSITORY')
    private setorEnvolvidoReposity: Repository<SetorEnvolvido>,
  ) {}
  

  async findSetores(
    crmId: number,
    crmVersao: number,
  ): Promise<SetorEnvolvido[]> {
    return await this.setorEnvolvidoReposity.find({
      select: {
        nomeSetor: true,
        matriculaColaborador: true,
        justificativa: true,
      },
      where: {
        crmId: crmId,
        crmVersao: crmVersao,
      },
      relations: {
        flag: true,
      },
    });
  }

  async saveSetores(
    crmId: number,
    crmVersao: number,
    setoresEnvolvidos: string[],
  ): Promise<any> {
    try {
      setoresEnvolvidos.map((setor) => {
        let setorEnvolvido = new SetorEnvolvido();
        setorEnvolvido.crmId = crmId;
        setorEnvolvido.crmVersao = crmVersao;
        setorEnvolvido.nomeSetor = setor;
        this.setorEnvolvidoReposity.save(setorEnvolvido)
      });
    } catch (error) {
      return error;
    }
  }
}

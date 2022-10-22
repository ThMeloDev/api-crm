import { Inject, Injectable } from '@nestjs/common';
import { Colaborador } from 'src/database/entities/colaborador.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ColaboradorService {
  constructor(
    @Inject('COLABORADOR_REPOSITORY')
    private colaboradorReposity: Repository<Colaborador>,
  ) {}

  async findOne(matricula: string): Promise<any> {
    const colaborador = await this.colaboradorReposity.findOneBy({matricula:matricula})
    const { senha, ...result } = colaborador;
    return result;
  }

  async listColaboradoresDoSetor(setor: string): Promise<Colaborador[]> {
    return await this.colaboradorReposity.find({
      select: {
        matricula: true,
        cpf: true,
        nome: true,
        sobrenome: true,
        email: true,
        telefone: true,
      },
      where: {
        setor: {
          nome: setor,
        },
      },
    });
  }

  async registerColaborador(data: any): Promise<any> {
    try {
      let colaborador = new Colaborador();
      colaborador.matricula = data.matricula;
      colaborador.cpf = data.cpf;
      colaborador.nome = data.nome;
      colaborador.sobrenome = data.sobrenome;
      colaborador.email = data.email;
      colaborador.telefone = data.telefone;
      colaborador.senha = bcrypt.hashSync(data.senha, 8);
      colaborador.setor = data.setor;
      await this.colaboradorReposity.save(colaborador);
      return {
        message: 'Colaborador cadastrado com sucesso',
      };
    } catch (error) {
      return error;
    }
  }
}

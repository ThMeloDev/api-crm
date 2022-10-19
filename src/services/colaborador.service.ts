import { Inject, Injectable } from '@nestjs/common';
import { Colaborador } from 'src/database/entities/colaborador.entity';
import { Repository } from 'typeorm';


@Injectable()
export class ColaboradorService {
  constructor(
    @Inject('COLABORADOR_REPOSITORY')
    private colaboradorReposity: Repository<Colaborador>,
  ) {}

  async findAll(): Promise<Colaborador[]> {
    return await this.colaboradorReposity.find();
  }

  async findOne(matricula: string): Promise<Colaborador> {
    return await this.colaboradorReposity.findOneBy({ matricula });
  }
  
}
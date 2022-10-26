import { Inject, Injectable } from '@nestjs/common';
import { Sistema } from 'src/database/entities/sistema.entity';
import { Repository } from 'typeorm';


@Injectable()
export class SistemaService {
  constructor(
    @Inject('SISTEMA_REPOSITORY')
    private sistemaReposity: Repository<Sistema>,
  ) {}

  async listSystems(): Promise<Sistema[]> {
    return await this.sistemaReposity.find({
      select: {
        nome: true
      },
      where:{
        ativo: true
      }
    });
  }

  async findOne(nome:string): Promise<Sistema> {
    return await this.sistemaReposity.findOneBy({ nome });
  }
  
}
import { Inject, Injectable } from '@nestjs/common';
import { Setor } from 'src/database/entities/setor.entity';
import { Repository } from 'typeorm';


@Injectable()
export class SetorService {
  constructor(
    @Inject('SETOR_REPOSITORY')
    private setorReposity: Repository<Setor>,
  ) {}

  async findAll(): Promise<Setor[]> {
    return await this.setorReposity.find();
  }

  async findOne(nome: string): Promise<Setor> {
    return await this.setorReposity.findOneBy({ nome });
  }
  
}
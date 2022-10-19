import { Inject, Injectable } from '@nestjs/common';
import { Complexidade } from 'src/database/entities/complexidade.entity';
import { Repository } from 'typeorm';


@Injectable()
export class ComplexidadeService {
  constructor(
    @Inject('COMPLEXIDADE_REPOSITORY')
    private complexidadeRepository: Repository<Complexidade>,
  ) {}

  async findAll(): Promise<Complexidade[]> {
    return await this.complexidadeRepository.find();
  }

  async findOne(nome: string): Promise<Complexidade> {
    return await this.complexidadeRepository.findOneBy({ nome });
  }
  
}
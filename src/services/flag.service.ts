import { Inject, Injectable } from '@nestjs/common';
import { Flag } from 'src/database/entities/flag.entity';
import { Repository } from 'typeorm';


@Injectable()
export class FlagService {
  constructor(
    @Inject('FLAG_REPOSITORY')
    private flagReposity: Repository<Flag>,
  ) {}

  async findAll(): Promise<Flag[]> {
    return await this.flagReposity.find();
  }

  async findOne(nome: string): Promise<Flag> {
    return await this.flagReposity.findOneBy({ nome });
  }
  
}
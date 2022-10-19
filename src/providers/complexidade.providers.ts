import { Complexidade } from 'src/database/entities/complexidade.entity';
import { DataSource } from 'typeorm';

export const complexidadeProviders = [
  {
    provide: 'COMPLEXIDADE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Complexidade),
    inject: ['DATA_SOURCE'],
  },
];
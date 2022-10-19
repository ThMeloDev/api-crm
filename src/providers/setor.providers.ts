import { Setor } from 'src/database/entities/setor.entity';
import { DataSource } from 'typeorm';

export const setorProviders = [
  {
    provide: 'SETOR_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Setor),
    inject: ['DATA_SOURCE'],
  },
];
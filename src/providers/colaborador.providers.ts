import { Colaborador } from 'src/database/entities/colaborador.entity';
import { DataSource } from 'typeorm';

export const colaboradorProviders = [
  {
    provide: 'COLABORADOR_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Colaborador),
    inject: ['DATA_SOURCE'],
  },
];
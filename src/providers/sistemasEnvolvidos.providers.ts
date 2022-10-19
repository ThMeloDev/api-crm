import { SistemasEnvolvidos } from 'src/database/entities/sistemasEnvolvidos.entity';
import { DataSource } from 'typeorm';

export const sistemasEnvolvidosProviders = [
  {
    provide: 'SISTEMASENVOLVIDOS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(SistemasEnvolvidos),
    inject: ['DATA_SOURCE'],
  },
];
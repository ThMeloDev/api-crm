import { Sistema } from 'src/database/entities/sistema.entity';
import { DataSource } from 'typeorm';

export const sistemaProviders = [
  {
    provide: 'SISTEMA_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Sistema),
    inject: ['DATA_SOURCE'],
  },
];
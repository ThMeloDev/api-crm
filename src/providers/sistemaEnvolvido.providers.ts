import { SistemaEnvolvido } from 'src/database/entities/sistemaEnvolvido.entity';
import { DataSource } from 'typeorm';

export const sistemaEnvolvidoProviders = [
  {
    provide: 'SISTEMAENVOLVIDO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(SistemaEnvolvido),
    inject: ['DATA_SOURCE'],
  },
];
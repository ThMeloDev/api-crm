import { SetorEnvolvido } from 'src/database/entities/setorEnvolvido.entity';
import { DataSource } from 'typeorm';

export const setorEnvolvidoProviders = [
  {
    provide: 'SETORENVOLVIDO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(SetorEnvolvido),
    inject: ['DATA_SOURCE'],
  },
];
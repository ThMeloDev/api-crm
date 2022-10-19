import { SetoresEnvolvidos } from 'src/database/entities/setoresEnvolvidos.entity';
import { DataSource } from 'typeorm';

export const setoresEnvolvidosProviders = [
  {
    provide: 'SETORESENVOLVIDOS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(SetoresEnvolvidos),
    inject: ['DATA_SOURCE'],
  },
];
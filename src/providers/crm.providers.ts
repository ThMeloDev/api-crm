import { Crm } from 'src/database/entities/crm.entity';
import { DataSource } from 'typeorm';

export const crmProviders = [
  {
    provide: 'CRM_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Crm),
    inject: ['DATA_SOURCE'],
  },
];
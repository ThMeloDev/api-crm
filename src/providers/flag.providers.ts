import { Flag } from 'src/database/entities/flag.entity';
import { DataSource } from 'typeorm';

export const flagProviders = [
  {
    provide: 'FLAG_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Flag),
    inject: ['DATA_SOURCE'],
  },
];
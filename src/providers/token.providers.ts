import { Token } from 'src/database/entities/token.entity';
import { DataSource } from 'typeorm';

export const tokenProviders = [
  {
    provide: 'TOKEN_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Token),
    inject: ['DATA_SOURCE'],
  },
];
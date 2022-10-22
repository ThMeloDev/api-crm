import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'qqTech',
        entities: [
            __dirname + '/entities/*.entity{.ts,.js}',
        ],
        synchronize: false,
      });

      return dataSource.initialize();
    },
  },
];
import { Module } from '@nestjs/common';
import { SistemaController } from 'src/controllers/sistema.controller';
import { sistemaProviders } from 'src/providers/sistema.providers';
import { SistemaService } from 'src/services/sistema.service';
import { DatabaseModule } from '../database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [SistemaController],
  providers: [
    ...sistemaProviders,
    SistemaService,
  ],
  exports:[SistemaService]
})
export class SistemaModule {}
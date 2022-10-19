import { Module } from '@nestjs/common';
import { SistemaEnvolvidoController } from 'src/controllers/sistemaEnvolvido.controllers';
import { sistemaEnvolvidoProviders } from 'src/providers/sistemaEnvolvido.providers';
import { SistemaEnvolvidoService } from 'src/services/sistemaEnvolvido.service';
import { DatabaseModule } from '../database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [SistemaEnvolvidoController],
  providers: [
    ...sistemaEnvolvidoProviders,
    SistemaEnvolvidoService,
  ],
})
export class SistemaEnvolvidoModule {}
import { Module } from '@nestjs/common';
import { SistemasEnvolvidosController } from 'src/controllers/sistemasEnvolvidos.controllers';
import { sistemasEnvolvidosProviders } from 'src/providers/sistemasEnvolvidos.providers';
import { SistemasEnvolvidosService } from 'src/services/sistemaEnvolvidos.service';
import { DatabaseModule } from '../database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [SistemasEnvolvidosController],
  providers: [
    ...sistemasEnvolvidosProviders,
    SistemasEnvolvidosService,
  ],
})
export class SistemaEnvolvidosModule {}
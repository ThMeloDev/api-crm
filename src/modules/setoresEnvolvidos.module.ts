import { Module } from '@nestjs/common';
import { setoresEnvolvidosController } from 'src/controllers/setoresEnvolvidos.controller';
import { setoresEnvolvidosProviders } from 'src/providers/setoresEnvolvidos.providers';
import { SetoresEnvolvidosService } from 'src/services/setoresEnvolvidos.service';
import { DatabaseModule } from '../database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [setoresEnvolvidosController],
  providers: [
    ...setoresEnvolvidosProviders,
    SetoresEnvolvidosService,
  ],
})
export class SetoresEnvolvidosModule {}
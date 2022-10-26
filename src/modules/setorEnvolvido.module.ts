import { Module } from '@nestjs/common';
import { SetorEnvolvidoController } from 'src/controllers/setorEnvolvido.controller';
import { setorEnvolvidoProviders } from 'src/providers/setorEnvolvido.providers';
import { SetorEnvolvidoService } from 'src/services/setorEnvolvido.service';
import { DatabaseModule } from '../database/database.module';



@Module({
  imports: [DatabaseModule],
  controllers: [SetorEnvolvidoController],
  providers: [
    ...setorEnvolvidoProviders,
    SetorEnvolvidoService,
  ],
  exports:[SetorEnvolvidoService]
})
export class SetorEnvolvidoModule {}
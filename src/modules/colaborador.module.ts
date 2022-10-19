import { Module } from '@nestjs/common';
import { ColaboradorController } from 'src/controllers/colaborador.controller';
import { colaboradorProviders } from 'src/providers/colaborador.providers';
import { ColaboradorService } from 'src/services/colaborador.service';
import { DatabaseModule } from '../database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [ColaboradorController],
  providers: [
    ...colaboradorProviders,
    ColaboradorService,
  ],
})
export class ColaboradorModule {}
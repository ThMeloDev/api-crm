import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ColaboradorModule } from './modules/colaborador.module';
import { ComplexidadeModule } from './modules/complexidade.module';
import { CrmModule } from './modules/crm.module';
import { DocumentoModule } from './modules/documento.module';
import { FlagModule } from './modules/flag.module';
import { SetorModule } from './modules/setor.module';
import { SetoresEnvolvidosModule } from './modules/setoresEnvolvidos.module';
import { SistemaModule } from './modules/sistema.module';
import { SistemaEnvolvidosModule } from './modules/sistemasEnvolvidos.module';

@Module({
  imports: 
  [
    ComplexidadeModule,
    CrmModule,
    SistemaModule,
    FlagModule,
    ColaboradorModule,
    SetorModule,
    DocumentoModule,
    SistemaEnvolvidosModule,
    SetoresEnvolvidosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

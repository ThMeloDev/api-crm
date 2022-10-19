import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ColaboradorModule } from './modules/colaborador.module';
import { ComplexidadeModule } from './modules/complexidade.module';
import { CrmModule } from './modules/crm.module';
import { DocumentoModule } from './modules/documento.module';
import { FlagModule } from './modules/flag.module';
import { SetorModule } from './modules/setor.module';
import { SetorEnvolvidoModule } from './modules/setorEnvolvido.module';
import { SistemaModule } from './modules/sistema.module';
import { SistemaEnvolvidoModule } from './modules/sistemaEnvolvido.module';

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
    SistemaEnvolvidoModule,
    SetorEnvolvidoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

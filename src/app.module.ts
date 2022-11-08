import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ColaboradorModule } from './modules/colaborador.module';
import { CrmModule } from './modules/crm.module';
import { DocumentoModule } from './modules/documento.module';
import { SetorModule } from './modules/setor.module';
import { SetorEnvolvidoModule } from './modules/setorEnvolvido.module';
import { SistemaModule } from './modules/sistema.module';
import { SistemaEnvolvidoModule } from './modules/sistemaEnvolvido.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';


@Module({
  imports: 
  [
    CrmModule,
    SistemaModule,
    ColaboradorModule,
    SetorModule,
    DocumentoModule,
    SistemaEnvolvidoModule,
    SetorEnvolvidoModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },],
})
export class AppModule {}

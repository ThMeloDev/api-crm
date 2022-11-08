import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { storage } from 'src/config/multer';
import { CrmController } from 'src/controllers/crm.controller';

import { crmProviders } from 'src/providers/crm.providers';
import { documentoProviders } from 'src/providers/documento.providers';
import { setorEnvolvidoProviders } from 'src/providers/setorEnvolvido.providers';
import { sistemaEnvolvidoProviders } from 'src/providers/sistemaEnvolvido.providers';
import { CrmService } from 'src/services/crm.service';

import { DatabaseModule } from '../database/database.module';
import { DocumentoModule } from './documento.module';
import { SetorModule } from './setor.module';
import { SistemaModule } from './sistema.module';

@Module({
  imports: [
    DatabaseModule,
    SetorModule,
    SistemaModule,
    DocumentoModule,
    MulterModule.register({
      dest: `${__dirname}\\..\\uploads`,
    }),
  ],
  controllers: [CrmController],
  providers: [
    ...crmProviders,
    ...setorEnvolvidoProviders,
    ...sistemaEnvolvidoProviders,
    ...documentoProviders,
    CrmService,
  ],
})
export class CrmModule {}

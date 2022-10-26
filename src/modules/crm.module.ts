import { Module } from '@nestjs/common';
import { CrmController } from 'src/controllers/crm.controller';

import { crmProviders } from 'src/providers/crm.providers';
import { setorEnvolvidoProviders } from 'src/providers/setorEnvolvido.providers';
import { sistemaEnvolvidoProviders } from 'src/providers/sistemaEnvolvido.providers';
import { CrmService } from 'src/services/crm.service';

import { DatabaseModule } from '../database/database.module';
import { SetorModule } from './setor.module';
import { SistemaModule } from './sistema.module';


@Module({
  imports: [DatabaseModule, SetorModule,SistemaModule],
  controllers: [CrmController],
  providers: [
    ...crmProviders,
    ...setorEnvolvidoProviders,
    ...sistemaEnvolvidoProviders,
    CrmService,
  ],
})
export class CrmModule {}
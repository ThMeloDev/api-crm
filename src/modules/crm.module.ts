import { Module } from '@nestjs/common';
import { CrmController } from 'src/controllers/crm.controller';
import { crmProviders } from 'src/providers/crm.providers';
import { CrmService } from 'src/services/crm.service';

import { DatabaseModule } from '../database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [CrmController],
  providers: [
    ...crmProviders,
    CrmService,
  ],
})
export class CrmModule {}
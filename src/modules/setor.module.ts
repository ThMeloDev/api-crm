import { Module } from '@nestjs/common';
import { SetorController } from 'src/controllers/setor.controller';
import { setorProviders } from 'src/providers/setor.providers';
import { SetorService } from 'src/services/setor.service';
import { DatabaseModule } from '../database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [SetorController],
  providers: [
    ...setorProviders,
    SetorService,
  ],
  exports:[SetorService]
})
export class SetorModule {}
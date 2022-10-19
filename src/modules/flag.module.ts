import { Module } from '@nestjs/common';
import { FlagController } from 'src/controllers/flag.controller';
import { flagProviders } from 'src/providers/flag.providers';
import { FlagService } from 'src/services/flag.service';
import { DatabaseModule } from '../database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [FlagController],
  providers: [
    ...flagProviders,
    FlagService,
  ],
})
export class FlagModule {}
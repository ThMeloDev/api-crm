import { Module } from '@nestjs/common';
import { ComplexidadeController } from 'src/controllers/complexidade.controller';
import { complexidadeProviders } from 'src/providers/complexidade.providers';
import { ComplexidadeService } from 'src/services/complexidade.service';
import { DatabaseModule } from '../database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [ComplexidadeController],
  providers: [
    ...complexidadeProviders,
    ComplexidadeService,
  ],
})
export class ComplexidadeModule {}
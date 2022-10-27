import { Module } from '@nestjs/common';
import { DocumentoController } from 'src/controllers/documento.controller';
import { documentoProviders } from 'src/providers/documento.providers';
import { DocumentoService } from 'src/services/documento.service';
import { DatabaseModule } from '../database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [DocumentoController],
  providers: [
    ...documentoProviders,
    DocumentoService,
  ],
  exports:[DocumentoService]
})
export class DocumentoModule {}
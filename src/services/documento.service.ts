import { Inject, Injectable } from '@nestjs/common';
import { Documento } from 'src/database/entities/documento.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentoService {
  constructor(
    @Inject('DOCUMENTO_REPOSITORY')
    private documentoReposity: Repository<Documento>,
  ) {}

  async findDocuments(crm_id: number, crm_versao: number): Promise<Documento[]> {
    return await this.documentoReposity.find({
      select: {pathDocumento:true},
      where: {
        crm_id: crm_id,
        crm_versao: crm_versao,
      }
    });
  }

  async findOne(
    pathDocumento: string,
    crm_id: number,
    crm_versao: number,
  ): Promise<Documento> {
    return await this.documentoReposity.findOneBy({
      pathDocumento,
      crm_id,
      crm_versao,
    });
  }
}

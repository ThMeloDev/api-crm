import { Inject, Injectable } from '@nestjs/common';
import { Documento } from 'src/database/entities/documento.entity';
import { Repository } from 'typeorm';
import * as multer from 'multer';
import {storage} from '../config/multer'


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

  async saveDocuments (crm_id: number, crm_versao: number,documentos) : Promise<any>{
    const upload = multer({storage:storage})
    try{
      documentos.map((document)=>{
        let documento = new Documento();
        upload.single(document)
       // documento.setProps({
       //   crm_id: crm_id,
       //   crm_versao: crm_versao,
       //   pathDocumento: 
       // })
        
      })
    }catch(error){
      return error
    }
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

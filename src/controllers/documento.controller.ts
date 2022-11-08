import { Controller, Get, HttpStatus, Query, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { Public } from 'src/auth/jwt-auth.guard';
import { Documento } from 'src/database/entities/documento.entity';
import { DocumentoService } from 'src/services/documento.service';


@Controller('documento')
export class DocumentoController {
  constructor(private readonly documentoService: DocumentoService) {}
  
  @Get('download')
   downloadDocument(@Query() params, @Res({ passthrough: true }) res: Response) {
    const file = createReadStream(params.pathDocumento);
    let filename = params.pathDocumento
    filename = filename.split('\\')
    filename = filename[filename.length - 1].split('-filename')
    filename = filename[1]
    res.set({
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    return new StreamableFile(file);
  }

  @Get()
  async findOne(@Query() params, @Res() res: any ): Promise<Documento> {
    if (params.path === null || params.path === undefined) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
        {
          'statusCode': 500,
          'message': 'pathDocumento não foi informado',
          'error': 'Internal Server Error'
        }
      )
    }
    if (params.id === null || params.id === undefined) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
          {
            'statusCode': 500,
            'message': 'id não foi informada',
            'error': 'Internal Server Error'
          }
        )
    }
    if (params.versao === null || params.versao === undefined) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
          {
            'statusCode': 500,
            'message': 'versão não foi informada',
            'error': 'Internal Server Error'
          }
        )
    }
    return res.send(await this.documentoService.findOne(params.path,params.id,params.versao)) ;
  }


}

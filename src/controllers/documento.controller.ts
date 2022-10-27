import { Body, Controller, Get, HttpStatus, Post, Query, Response } from '@nestjs/common';
import { Documento } from 'src/database/entities/documento.entity';
import { DocumentoService } from 'src/services/documento.service';


@Controller('documento')
export class DocumentoController {
  constructor(private readonly documentoService: DocumentoService) {}

  @Get('crm')
  async findDocuments(@Query() params, @Response() res: any): Promise<Documento[]> {
      if (params.id === null || params.id === undefined) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
            {
              'statusCode': 500,
              'message': 'id não foi informado',
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
    return res.send(await this.documentoService.findDocuments(params.id , params.versao));
  }

  @Get()
  async findOne(@Query() params, @Response() res: any ): Promise<Documento> {
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

  @Post('save')
  async saveDocuments(@Body() params): Promise<any>{
    return await this.documentoService.saveDocuments(params.crm_id, params.crm_versao,params.documentos)
  }

}

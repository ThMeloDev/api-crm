import { Controller, Get, HttpStatus, Query, Response } from '@nestjs/common';
import { SistemaEnvolvido } from 'src/database/entities/sistemaEnvolvido.entity';
import { SistemaEnvolvidoService } from 'src/services/sistemaEnvolvido.service';


@Controller('sistemaEnvolvido')
export class SistemaEnvolvidoController {
  constructor(private readonly sistemaEnvolvidoService: SistemaEnvolvidoService) {}

  @Get('all')
  async findDocuments(@Query() params, @Response() res: any): Promise<SistemaEnvolvido[]> {
      if (params.crmId === null || params.crmId === undefined) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
            {
              'statusCode': 500,
              'message': 'crmId não foi informado',
              'error': 'Internal Server Error'
            }
          )
      }
      if (params.crmVersao === null || params.crmVersao === undefined) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
            {
              'statusCode': 500,
              'message': 'crmVersao não foi informada',
              'error': 'Internal Server Error'
            }
          )
      }
    return res.send(await this.sistemaEnvolvidoService.findSistemas(params.crmId , params.crmVersao));
  }

  @Get()
  async findOne(@Query() params, @Response() res: any): Promise<SistemaEnvolvido> {
    if (params.sistemaNome === null || params.sistemaNome === undefined) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
          {
            'statusCode': 500,
            'message': 'sistemaNome não foi informado',
            'error': 'Internal Server Error'
          }
        )
    }
    if (params.crmId === null || params.crmId === undefined) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
          {
            'statusCode': 500,
            'message': 'crmId não foi informado',
            'error': 'Internal Server Error'
          }
        )
    }
    if (params.crmVersao === null || params.crmVersao === undefined) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
          {
            'statusCode': 500,
            'message': 'crmVersao não foi informada',
            'error': 'Internal Server Error'
          }
        )
    }
  return res.send(await this.sistemaEnvolvidoService.findOne(params.sistemaNome,params.crmId , params.crmVersao));
}
}

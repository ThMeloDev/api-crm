import { Controller, Get, HttpStatus, Query, Response } from '@nestjs/common';
import { SistemasEnvolvidos } from 'src/database/entities/sistemasEnvolvidos.entity';
import { SistemasEnvolvidosService } from 'src/services/sistemaEnvolvidos.service';


@Controller('sistemasEnvolvidos')
export class SistemasEnvolvidosController {
  constructor(private readonly sistemasEnvolvidosService: SistemasEnvolvidosService) {}

  @Get('all')
  async findDocuments(@Query() params, @Response() res: any): Promise<SistemasEnvolvidos[]> {
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
    return res.send(await this.sistemasEnvolvidosService.findSistemas(params.crmId , params.crmVersao));
  }

  @Get()
  async findOne(@Query() params, @Response() res: any): Promise<SistemasEnvolvidos> {
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
  return res.send(await this.sistemasEnvolvidosService.findOne(params.sistemaNome,params.crmId , params.crmVersao));
}
}

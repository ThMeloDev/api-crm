import { Controller, Get, HttpStatus, Query, Response } from '@nestjs/common';
import { SetoresEnvolvidos } from 'src/database/entities/setoresEnvolvidos.entity';
import { SetoresEnvolvidosService } from 'src/services/setoresEnvolvidos.service';

@Controller('setoresEnvolvidos')
export class setoresEnvolvidosController {
  constructor(
    private readonly setoresEnvolvidosService: SetoresEnvolvidosService,
  ) {}

  @Get('all')
  async findDocuments(
    @Query() params,
    @Response() res: any,
  ): Promise<SetoresEnvolvidos[]> {
    if (params.crmId === null || params.crmId === undefined) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: 500,
        message: 'crmId não foi informado',
        error: 'Internal Server Error',
      });
    }
    if (params.crmVersao === null || params.crmVersao === undefined) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: 500,
        message: 'crmVersao não foi informada',
        error: 'Internal Server Error',
      });
    }
    return res.send(
      await this.setoresEnvolvidosService.findSetores(
        params.crmId,
        params.crmVersao,
      ),
    );
  }

  @Get()
  async findOne(
    @Query() params,
    @Response() res: any,
  ): Promise<SetoresEnvolvidos> {
    if (params.setorNome === null || params.setorNome === undefined) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: 500,
        message: 'setorNome não foi informado',
        error: 'Internal Server Error',
      });
    }
    if (params.crmId === null || params.crmId === undefined) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: 500,
        message: 'crmId não foi informado',
        error: 'Internal Server Error',
      });
    }
    if (params.crmVersao === null || params.crmVersao === undefined) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: 500,
        message: 'crmVersao não foi informada',
        error: 'Internal Server Error',
      });
    }
    return res.send(
      await this.setoresEnvolvidosService.findOne(
        params.sistemaNome,
        params.crmId,
        params.crmVersao,
      ),
    );
  }
}

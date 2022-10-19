import { Controller, Get, HttpStatus, Query, Response } from '@nestjs/common';
import { SetorEnvolvido } from 'src/database/entities/setorEnvolvido.entity';
import { SetorEnvolvidoService } from 'src/services/setorEnvolvido.service';

@Controller('setorEnvolvido')
export class SetorEnvolvidoController {
  constructor(
    private readonly setorEnvolvidoService: SetorEnvolvidoService,
  ) {}

  @Get('all')
  async findDocuments(
    @Query() params,
    @Response() res: any,
  ): Promise<SetorEnvolvido[]> {
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
      await this.setorEnvolvidoService.findSetores(
        params.crmId,
        params.crmVersao,
      ),
    );
  }

  @Get()
  async findOne(
    @Query() params,
    @Response() res: any,
  ): Promise<SetorEnvolvido> {
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
      await this.setorEnvolvidoService.findOne(
        params.sistemaNome,
        params.crmId,
        params.crmVersao,
      ),
    );
  }
}

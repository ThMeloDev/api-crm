import { Controller, Get, HttpStatus, Query, Response } from '@nestjs/common';
import { Colaborador } from 'src/database/entities/colaborador.entity';
import { ColaboradorService } from 'src/services/colaborador.service';


@Controller('colaborador')
export class ColaboradorController {
  constructor(private readonly colaboradorService: ColaboradorService) {}

  @Get('all')
  async findAll(): Promise<Colaborador[]> {
    return await this.colaboradorService.findAll();
  }

  @Get()
  async findOne(@Query() params, @Response() res: any ): Promise<Colaborador> {
    if (params.matricula === null || params.matricula === undefined || typeof params.matricula != 'string') {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
        {
          'statusCode': 500,
          'message': 'a matricula não foi informada ou não é uma string',
          'error': 'Internal Server Error'
        }
      )
    }
    return res.send(await this.colaboradorService.findOne(params.matricula)) ;
  }
}

import { Body, Controller, Get, Post, Query, UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Colaborador } from 'src/database/entities/colaborador.entity';
import { ColaboradorService } from 'src/services/colaborador.service';



@Controller('colaborador')
export class ColaboradorController {
  constructor(private readonly colaboradorService: ColaboradorService) {}

  @Get('/:setor')
  async listColaboradoresDoSetor(@Query() params): Promise<Colaborador[]> {
    return await this.colaboradorService.listColaboradoresDoSetor(params.setor);
  }

  @Post('cadastrar')
  async registerColaborador(@Body() data): Promise<any> {
    return await this.colaboradorService.registerColaborador(data)
  }
  
  @Get()
  async findOne(@Query() params): Promise<any> {
    return await this.colaboradorService.findOne(params.matricula)
  }


}

import { Injectable } from '@nestjs/common';
import { ColaboradorService } from 'src/services/colaborador.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private colaboradorService: ColaboradorService) {}

  async validateUser(matricula: string, senha: string): Promise<any> {
    const colaborador = await this.colaboradorService.findOne(matricula);
    if (colaborador && bcrypt.compareSync(senha, colaborador.senha)) {
      const { senha, ...result } = colaborador;
      return result;
    }
    return null;
  }
}

import { Injectable } from '@nestjs/common';
import { ColaboradorService } from 'src/services/colaborador.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/services/token.service';

@Injectable()
export class AuthService {
    constructor(
      private colaboradorService: ColaboradorService,
      private jwtService: JwtService,
      private tokenService: TokenService
      ) {}

  async validateUser(matricula: string, senha: string): Promise<any> {
    const colaborador = await this.colaboradorService.findOneLogin(matricula);
    if (colaborador && bcrypt.compareSync(senha, colaborador.senha)) {
      const { senha, ...result } = colaborador;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.matricula, sub: user.matricula };
    const token = this.jwtService.sign(payload)
    this.tokenService.save(token,user.matricula)
    return {
      access_token: token,
    };
  }
}

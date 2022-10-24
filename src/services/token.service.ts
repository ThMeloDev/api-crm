import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Token } from 'src/database/entities/token.entity';
import { Repository } from 'typeorm';
import { ColaboradorService } from './colaborador.service';


@Injectable()
export class TokenService {
  constructor(
    @Inject('TOKEN_REPOSITORY')
    private tokenReposity: Repository<Token>,
    private colaboradorService: ColaboradorService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService
  ) {}

  async save(hash: string, username: string){
    let objToken = await this.tokenReposity.findOneBy({username:username})
    if(objToken){
      this.tokenReposity.update(objToken.id,{
        hash:hash
      })
    }else{
      let token = new Token()
      token.hash = hash
      token.username = username
      this.tokenReposity.save(token)
    }
  }

  async refresh(oldToken: string){
    const objToken = await this.tokenReposity.findOneBy({hash:oldToken})
    if(objToken){
      let colaborador = await this.colaboradorService.findOneLogin(objToken.username)
      return this.authService.login(colaborador)
    }else{
      return new HttpException({
        errorMessage: "Token Inválido"
      }, HttpStatus.UNAUTHORIZED)
    }
  }
}
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ColaboradorModule } from 'src/modules/colaborador.module';
import { TokenModule } from 'src/modules/token.module';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    ColaboradorModule,
    TokenModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      //signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy,JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ColaboradorModule } from 'src/modules/colaborador.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

@Module({
  imports:[ColaboradorModule, PassportModule],
  providers: [AuthService, LocalStrategy]
})
export class AuthModule {}

import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TokenController } from 'src/controllers/token.controller';
import { tokenProviders } from 'src/providers/token.providers';
import { TokenService } from 'src/services/token.service';
import { DatabaseModule } from '../database/database.module';
import { ColaboradorModule } from './colaborador.module';


@Module({
  imports: [DatabaseModule, forwardRef(() => AuthModule), ColaboradorModule],
  controllers: [TokenController],
  providers: [
    ...tokenProviders,
    TokenService,
  ],
  exports:[TokenService]
})
export class TokenModule {}
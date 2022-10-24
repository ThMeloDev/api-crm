import { Body, Controller, Put, Query } from '@nestjs/common';
import { Public } from 'src/auth/jwt-auth.guard';
import { TokenService } from 'src/services/token.service';



@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}
  
  @Public()
  @Put('refresh')
  async refresh(@Body() data): Promise<any> {
    return await this.tokenService.refresh(data.oldToken);
  }
}

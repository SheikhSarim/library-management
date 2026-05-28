import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthType } from './modules/auth/enum/auth-type.enum';
import { Auth } from './modules/auth/decorators/auth.decorator';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Auth(AuthType.None)
  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }

  @Auth(AuthType.None)
  @Get('/health')
  healthCheck() {
    return this.appService.healthCheck();
  }
}

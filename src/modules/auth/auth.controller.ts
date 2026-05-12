import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./providers/auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { Auth } from "./decorators/auth.decorator";
import { AuthType } from "./enum/auth-type.enum";

@ApiTags("Auth")
@Controller("api/v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @Auth(AuthType.None) // public route
  @ApiOperation({ summary: "Register a new user (MEMBER or AUTHOR)" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @Auth(AuthType.None) // public route
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login with email and password" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

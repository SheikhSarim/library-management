import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './providers/auth.service';
import { RegisterMemberDto } from './dto/register-member.dto';
// import { RegisterAuthorDto } from './dto/register-author.dto';
// import { LoginMemberDto } from './dto/login-member.dto';
// import { LoginAuthorDto } from './dto/login-author.dto';
import { GoogleTokenDto } from './social/dtos/google-token.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enum/auth-type.enum';
import { LoginMemberDto } from './dto/login-member.dto';
import { RegisterAuthorDto } from './dto/register-author.dto';
import { LoginAuthorDto } from './dto/login-author.dto';

@ApiTags('Auth')
@Auth(AuthType.None) // saare auth routes public hain
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ════════════════════════════
  // MEMBER — REGISTER
  // ════════════════════════════
  @Post('member/register')
  @ApiOperation({ summary: 'Register new Member (email + password)' })
  registerMember(@Body() dto: RegisterMemberDto) {
    return this.authService.registerMember(dto);
  }

  @Post('member/register/google')
  @ApiOperation({ summary: 'Register new Member via Google OAuth' })
  registerMemberGoogle(@Body() dto: GoogleTokenDto) {
    return this.authService.registerMemberGoogle(dto);
  }

  // ════════════════════════════
  // MEMBER — LOGIN
  // ════════════════════════════
  @Post('member/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Member login (email + password)' })
  loginMember(@Body() dto: LoginMemberDto) {
    return this.authService.loginMember(dto);
  }

  // @Post('member/login/google')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Member login via Google OAuth' })
  // loginMemberGoogle(@Body() dto: GoogleTokenDto) {
  //   return this.authService.loginMemberGoogle(dto);
  // }

  // // ════════════════════════════
  // // AUTHOR — REGISTER
  // // ════════════════════════════
  @Post('author/register')
  @ApiOperation({ summary: 'Register new Author (email + password)' })
  registerAuthor(@Body() dto: RegisterAuthorDto) {
    return this.authService.registerAuthor(dto);
  }

  // @Post('author/register/google')
  // @ApiOperation({ summary: 'Register new Author via Google OAuth' })
  // registerAuthorGoogle(@Body() dto: GoogleTokenDto) {
  //   return this.authService.registerAuthorGoogle(dto);
  // }

  // // ════════════════════════════
  // // AUTHOR — LOGIN
  // // ════════════════════════════
  @Post('author/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Author login (email + password)' })
  loginAuthor(@Body() dto: LoginAuthorDto) {
    return this.authService.loginAuthor(dto);
  }

  // @Post('author/login/google')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Author login via Google OAuth' })
  // loginAuthorGoogle(@Body() dto: GoogleTokenDto) {
  //   return this.authService.loginAuthorGoogle(dto);
  // }
}

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express'; // ← Yeh change kiya (import type)

import { AuthService } from './providers/auth.service';

import { RegisterMemberDto } from './dto/register-member.dto';
import { RegisterAuthorDto } from './dto/register-author.dto';
// import { LoginMemberDto } from './dto/login-member.dto';
// import { LoginAuthorDto } from './dto/login-author.dto';
import { GoogleTokenDto } from './social/dtos/google-token.dto';

import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enum/auth-type.enum';

@ApiTags('Auth')
@Auth(AuthType.None)
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ════════════════════════════
  // MEMBER — REGISTER
  // ════════════════════════════
  @Post('member/register')
  @ApiOperation({ summary: 'Register/Login new Member (email + password)' })
  registerMember(
    @Body() dto: RegisterMemberDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.registerMember(dto, response);
  }

  @Post('member/register/google')
  @ApiOperation({ summary: 'Register/Login Member via Google OAuth' })
  registerMemberGoogle(
    @Body() dto: GoogleTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.registerMemberGoogle(dto, response);
  }

  // ════════════════════════════
  // MEMBER — LOGIN
  // ════════════════════════════
  // @Post('member/login')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Member login (email + password)' })
  // loginMember(
  //   @Body() dto: LoginMemberDto,
  //   @Res({ passthrough: true }) response: Response,
  // ) {
  //   return this.authService.loginMember(dto, response);
  // }

  // @Post('member/login/google')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Member login via Google OAuth' })
  // loginMemberGoogle(
  //   @Body() dto: GoogleTokenDto,
  //   @Res({ passthrough: true }) response: Response,
  // ) {
  //   return this.authService.loginMemberGoogle(dto, response);
  // }

  // ════════════════════════════
  // AUTHOR — REGISTER
  // ════════════════════════════
  @Post('author/register')
  @ApiOperation({ summary: 'Register/Login new Author (email + password)' })
  registerAuthor(
    @Body() dto: RegisterAuthorDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.registerAuthor(dto, response);
  }

  @Post('author/register/google')
  @ApiOperation({ summary: 'Register/Login new Author via Google OAuth' })
  registerAuthorGoogle(
    @Body() dto: GoogleTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.registerAuthorGoogle(dto, response);
  }

  // ════════════════════════════
  // AUTHOR — LOGIN
  // ════════════════════════════
  // @Post('author/login')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Author login (email + password)' })
  // loginAuthor(
  //   @Body() dto: LoginAuthorDto,
  //   @Res({ passthrough: true }) response: Response,
  // ) {
  //   return this.authService.loginAuthor(dto, response);
  // }

  // @Post('author/login/google')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Author login via Google OAuth' })
  // loginAuthorGoogle(
  //   @Body() dto: GoogleTokenDto,
  //   @Res({ passthrough: true }) response: Response,
  // ) {
  //   return this.authService.loginAuthorGoogle(dto, response);
  // }
}

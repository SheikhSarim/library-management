import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { request, type Response } from 'express';

import { AuthService } from './providers/auth.service';

import { RegisterMemberDto } from './dto/register-member.dto';
import { RegisterAuthorDto } from './dto/register-author.dto';
import { GoogleTokenDto } from './social/dtos/google-token.dto';

import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enum/auth-type.enum';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Auth(AuthType.None)
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Silent Session Check
  @Get('session')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Silent session check on app start' })
  async session(@Req() req: any) {
    // console.log('[Session] Cookies:', req.cookies);
    // console.log('[Session] All cookies:', req.cookies);
    // console.log('[Session] access_token:', req.cookies?.access_token);

    if (!req.user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.authService.getSession(req.user.id);
  }

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
}

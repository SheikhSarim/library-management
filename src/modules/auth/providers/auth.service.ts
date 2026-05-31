import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

import { RegisterMemberDto } from '../dto/register-member.dto';
import { RegisterAuthorDto } from '../dto/register-author.dto';

import { GoogleTokenDto } from '../social/dtos/google-token.dto';

import { RegisterMemberProvider } from './register-member.provider';

import { RegisterAuthorProvider } from './register-author.provider';
import { UsersService } from '../../users/service/users.service';
import { RefreshProvider } from './refresh.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerMemberProvider: RegisterMemberProvider,
    private readonly registerAuthorProvider: RegisterAuthorProvider,

    private readonly refreshProvider: RefreshProvider,

    private readonly usersService: UsersService,
  ) {}
  // ── MEMBER ──
  registerMember(dto: RegisterMemberDto, response: Response) {
    return this.registerMemberProvider.registerByEmail(dto, response);
  }

  registerMemberGoogle(dto: GoogleTokenDto, response: Response) {
    return this.registerMemberProvider.registerByGoogle(dto, response);
  }

  // ── AUTHOR ──
  registerAuthor(dto: RegisterAuthorDto, response: Response) {
    return this.registerAuthorProvider.registerByEmail(dto, response);
  }

  registerAuthorGoogle(dto: GoogleTokenDto, response: Response) {
    return this.registerAuthorProvider.registerByGoogle(dto, response);
  }

  refresh(request: Request, response: Response) {
    return this.refreshProvider.refresh(request, response);
  }

  async getSession(userId: number) {
    const user = await this.usersService.findUserById(userId);

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    return {
      success: true,
      data: {
        isAuthenticated: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
    };
  }
}

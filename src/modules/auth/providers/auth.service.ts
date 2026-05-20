import { Injectable } from '@nestjs/common';
import { Response } from 'express';                    // ← Yeh add kiya

import { RegisterMemberDto } from '../dto/register-member.dto';
import { RegisterAuthorDto } from '../dto/register-author.dto';

import { GoogleTokenDto } from '../social/dtos/google-token.dto';

import { RegisterMemberProvider } from './register-member.provider';

import { RegisterAuthorProvider } from './register-author.provider';


@Injectable()
export class AuthService {
  constructor(
    private readonly registerMemberProvider: RegisterMemberProvider,
    private readonly registerAuthorProvider: RegisterAuthorProvider,

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
}
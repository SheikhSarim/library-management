import { Injectable } from '@nestjs/common';
import { RegisterMemberDto } from '../dto/register-member.dto';

import { GoogleTokenDto } from '../social/dtos/google-token.dto';
import { RegisterMemberProvider } from './register-member.provider';
import { LoginMemberDto } from '../dto/login-member.dto';
import { LoginMemberProvider } from './login-member.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerMemberProvider: RegisterMemberProvider,
    private readonly loginMemberProvider: LoginMemberProvider,
    // private readonly registerAuthorProvider: RegisterAuthorProvider,
    // private readonly loginAuthorProvider: LoginAuthorProvider,
  ) {}

  // ── MEMBER ──
  registerMember(dto: RegisterMemberDto) {
    return this.registerMemberProvider.registerByEmail(dto);
  }
  registerMemberGoogle(dto: GoogleTokenDto) {
    return this.registerMemberProvider.registerByGoogle(dto);
  }
  loginMember(dto: LoginMemberDto) {
    return this.loginMemberProvider.loginByEmail(dto);
  }
  // loginMemberGoogle(dto: GoogleTokenDto) {
  //   return this.loginMemberProvider.loginByGoogle(dto);
  // }

  // // ── AUTHOR ──
  // registerAuthor(dto: RegisterAuthorDto) {
  //   return this.registerAuthorProvider.registerByEmail(dto);
  // }
  // registerAuthorGoogle(dto: GoogleTokenDto) {
  //   return this.registerAuthorProvider.registerByGoogle(dto);
  // }
  // loginAuthor(dto: LoginAuthorDto) {
  //   return this.loginAuthorProvider.loginByEmail(dto);
  // }
  // loginAuthorGoogle(dto: GoogleTokenDto) {
  //   return this.loginAuthorProvider.loginByGoogle(dto);
  // }
}

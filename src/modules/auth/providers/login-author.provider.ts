import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { LoginAuthorDto } from '../dto/login-author.dto';
import { GoogleTokenDto } from '../social/dtos/google-token.dto';
import { UsersService } from '../../users/service/users.service';
import { HashProvider } from './hash.provider';
import { GenerateTokenProvider } from './generate-token.provider';
import { GoogleAuthService } from '../social/providers/google-auth.service';
import { Role } from '../../../common/enum/roles.enum';

@Injectable()
export class LoginAuthorProvider {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashProvider: HashProvider,
    private readonly generateTokenProvider: GenerateTokenProvider,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  // ──────────────────────────────
  // EMAIL + PASSWORD LOGIN
  // ──────────────────────────────
  async loginByEmail(dto: LoginAuthorDto) {
    const user = await this.usersService.findUserByEmail(dto.email);

    // Role check — sirf AUTHOR yahan se login kare
    if (user.role !== Role.AUTHOR) {
      throw new ForbiddenException('This login is for Authors only. Use /auth/member/login.');
    }

    const isValid = await this.hashProvider.comparePassword(dto.password, user.password!);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const tokens = await this.generateTokenProvider.generateTokens(user);

    return {
      success: true,
      message: 'Author logged in successfully',
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        ...tokens,
      },
    };
  }

  // ──────────────────────────────
  // GOOGLE LOGIN
  // ──────────────────────────────
  async loginByGoogle(googleTokenDto: GoogleTokenDto) {
    const googleUser = await this.googleAuthService.verifyToken(googleTokenDto.token);
    const user = await this.usersService.findUserByEmail(googleUser.email);

    if (user.role !== Role.AUTHOR) {
      throw new ForbiddenException('This Google login is for Authors only.');
    }

    const tokens = await this.generateTokenProvider.generateTokens(user);

    return {
      success: true,
      message: 'Author logged in via Google',
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        ...tokens,
      },
    };
  }
}

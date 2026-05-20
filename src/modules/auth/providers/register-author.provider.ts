import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { RegisterAuthorDto } from '../dto/register-author.dto';
import { GoogleTokenDto } from '../social/dtos/google-token.dto';
import { UsersService } from '../../users/service/users.service';
import { AuthorService } from '../../author/services/author.service';
import { HashProvider } from './hash.provider';
import { GenerateTokenProvider } from './generate-token.provider';
import { GoogleAuthService } from '../social/providers/google-auth.service';
import { Role } from '../../../common/enum/roles.enum';

@Injectable()
export class RegisterAuthorProvider {
  constructor(
    private readonly usersService: UsersService,
    private readonly authorService: AuthorService,
    private readonly hashProvider: HashProvider,
    private readonly generateTokenProvider: GenerateTokenProvider,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  async registerByEmail(dto: RegisterAuthorDto, response?: Response) {
    let user = await this.usersService.findUserByEmailOrNull(dto.email);

    // ================= LOGIN =================
    if (user) {
      if (user.role !== Role.AUTHOR) {
        throw new UnauthorizedException(
          `This email is already registered as ${user.role}`,
        );
      }

      if (!dto.password) {
        throw new BadRequestException('Password is required to login');
      }

      const isValid = await this.hashProvider.comparePassword(
        dto.password,
        user.password!,
      );

      if (!isValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const tokens = await this.generateTokenProvider.generateTokens(
        user,
        response,
      );

      return this.buildResponse('Logged in successfully', user, tokens);
    }

    // ================= REGISTER =================
    if (!dto.password) {
      throw new BadRequestException('Password is required for registration');
    }

    const hashedPassword = await this.hashProvider.hashPassword(dto.password);

    user = await this.usersService.createUser({
      email: dto.email,
      password: hashedPassword,
      role: Role.AUTHOR,
    });

    const author = await this.authorService.createForUser(user);

    const tokens = await this.generateTokenProvider.generateTokens(
      user,
      response,
    );

    return {
      success: true,
      message: 'Account created and logged in successfully',
      data: {
        user: this.sanitizeUser(user),
        author: { id: author.id },
        ...tokens,
      },
    };
  }

  // =========================
  // 🔥 GOOGLE LOGIN / REGISTER
  // =========================
  async registerByGoogle(googleTokenDto: GoogleTokenDto, response?: Response) {
    const googleUser = await this.googleAuthService.verifyToken(
      googleTokenDto.token,
    );

    let user = await this.usersService.findUserByEmailOrNull(googleUser.email);

    // ================= LOGIN =================
    if (user) {
      if (user.role !== Role.AUTHOR) {
        throw new UnauthorizedException(
          `This email is already registered as ${user.role}`,
        );
      }

      const tokens = await this.generateTokenProvider.generateTokens(
        user,
        response,
      );

      return this.buildResponse('Logged in via Google', user, tokens);
    }

    // ================= REGISTER =================
    user = await this.usersService.createGoogleUser({
      email: googleUser.email,
      googleId: googleUser.googleId,
      role: googleTokenDto.role || Role.AUTHOR,
      name: googleUser.name || '',
    });

    const author = await this.authorService.createForUser(user);

    const tokens = await this.generateTokenProvider.generateTokens(
      user,
      response,
    );

    return {
      success: true,
      message: 'Registered via Google successfully',
      data: {
        user: this.sanitizeUser(user),
        author: {
          id: author.id,
        },
        ...tokens,
      },
    };
  }

  // =========================
  // 🧠 HELPERS (CLEAN CODE)
  // =========================

  private sanitizeUser(user: any) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  private buildResponse(message: string, user: any, tokens: any) {
    return {
      success: true,
      message,
      data: {
        user: this.sanitizeUser(user),
        ...tokens,
      },
    };
  }
}

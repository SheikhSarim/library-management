import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";

import { AuthController } from "./auth.controller";
import { AuthService } from "./providers/auth.service";
import { RegisterProvider } from "./providers/register.provider";
import { LoginProvider } from "./providers/login.provider";
import { GenerateTokenProvider } from "./providers/generate-token.provider";
import { HashProvider } from "./providers/hash.provider";
import { BcryptProvider } from "./providers/bcrypt.provider";
import { AccessTokenGuard } from "./guards/access-token.guard";
import { AuthenticationGuard } from "./guards/authentication.guard";
import { RolesGuard } from "./guards/roles.guard";

import jwtConfig from "./config/jwt.config";
import { UsersModule } from "../users/user.module";
import { MemberModule } from "../member/member.module";
import { AuthorModule } from "../author/author.module";

@Module({
  imports: [
    UsersModule,
    MemberModule,  // RegisterProvider MemberService use karega
    AuthorModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RegisterProvider,
    LoginProvider,
    GenerateTokenProvider,
    AccessTokenGuard,
    AuthenticationGuard,
    RolesGuard,
    {
      provide: HashProvider,
      useClass: BcryptProvider,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AuthService, HashProvider, GenerateTokenProvider, AccessTokenGuard],
})
export class AuthModule {}

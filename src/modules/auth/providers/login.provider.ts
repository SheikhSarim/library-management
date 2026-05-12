import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "../dto/login.dto";
import { UsersService } from "../../users/service/users.service";
import { HashProvider } from "./hash.provider";
import { GenerateTokenProvider } from "./generate-token.provider";

@Injectable()
export class LoginProvider {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashProvider: HashProvider,
    private readonly generateTokenProvider: GenerateTokenProvider,
  ) {}

  async login(loginDto: LoginDto) {
    // Step 1: email se user dhundo
    const user = await this.usersService.findUserByEmail(loginDto.email);

    // Step 2: password verify karo
    const isPasswordValid = await this.hashProvider.comparePassword(
      loginDto.password,
      user.password!,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    // Step 3: JWT generate karo
    const tokens = await this.generateTokenProvider.generateTokens(user);

    return {
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        ...tokens,
      },
    };
  }
}

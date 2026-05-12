import { Injectable } from "@nestjs/common";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { RegisterProvider } from "./register.provider";
import { LoginProvider } from "./login.provider";

@Injectable()
export class AuthService {
  constructor(
    private readonly registerProvider: RegisterProvider,
    private readonly loginProvider: LoginProvider,
  ) {}

  async register(registerDto: RegisterDto) {
    return this.registerProvider.register(registerDto);
  }

  async login(loginDto: LoginDto) {
    return this.loginProvider.login(loginDto);
  }
}

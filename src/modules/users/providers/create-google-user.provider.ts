import { Injectable, RequestTimeoutException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { Role } from "../../../common/enum/roles.enum";
import { GoogleUser } from "../interface/google-user.interface";

@Injectable()
export class CreateGoogleUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createGoogleUser(googleUser: GoogleUser): Promise<User> {
    const user = this.usersRepository.create({
      name: googleUser.email.split("@")[0], // naam email se derive karo
      email: googleUser.email,
      googleId: googleUser.googleId,
      role: Role.MEMBER,
    });

    try {
      return await this.usersRepository.save(user);
    } catch {
      throw new RequestTimeoutException("Could not create Google user. Try again.");
    }
  }
}

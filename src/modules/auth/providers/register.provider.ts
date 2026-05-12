import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { UsersService } from '../../users/service/users.service';
import { MemberService } from '../../member/services/member.service';
import { HashProvider } from './hash.provider';
import { GenerateTokenProvider } from './generate-token.provider';
import { Role } from '../../../common/enum/roles.enum';
import { Member } from '../../member/entities/member.entity';
import { AuthorService } from '../../author/services/author.service';

@Injectable()
export class RegisterProvider {
  constructor(
    private readonly usersService: UsersService,
    private readonly memberService: MemberService,
    private readonly authorService: AuthorService,
    private readonly hashProvider: HashProvider,
    private readonly generateTokenProvider: GenerateTokenProvider,
  ) {}

  async register(registerDto: RegisterDto) {
    // Step 1: Hash password
    const hashedPassword = await this.hashProvider.hashPassword(
      registerDto.password,
    );

    // Step 2: Create user in DB
    const user = await this.usersService.createUser({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role,
    });

    // Step 3: MEMBER hai to auto member + card create karo
    let member: Member | null = null;
    let author: any = null;

    if (user.role === Role.MEMBER) {
      member = await this.memberService.createForUser(user);
    }

    if (user.role === Role.AUTHOR) {
      author = await this.authorService.create(user);
      // OR direct authorService use karo (best practice below)
    }
    // Step 4: JWT tokens generate karo
    const tokens = await this.generateTokenProvider.generateTokens(user);

    return {
      success: true,
      message: 'Registered successfully as ' + user.role,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        ...(member && {
          member: {
            id: member.id,
            membershipCard: member.membershipCard,
          },
        }),
        ...tokens,
      },
    };
  }
}

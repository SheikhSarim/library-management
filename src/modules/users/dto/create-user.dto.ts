import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Role } from "../../../common/enum/roles.enum";

// user.entity.ts mein sirf id, email, password, role, googleId hain
// name is field ko User entity mein add karna hoga
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "user@example.com" })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "hashedPassword" })
  @IsString()
  password: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;

  googleId?: string;
}

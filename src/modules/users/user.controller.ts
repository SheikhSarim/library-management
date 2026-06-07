import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UsersService } from './service/users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enum/auth-type.enum';
import { CompleteProfileDto } from './dto/complete-profile.dto';

@ApiTags('Users')
@Auth(AuthType.None)
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() activeUser) {
    return await this.usersService.getMe(activeUser.id);
  }
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async completeProfile(
    @CurrentUser() activeUser,
    @Body() dto: CompleteProfileDto,
  ) {
    if (!activeUser?.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.usersService.completeProfile(activeUser.id, dto);
  }

  @Get(':id')
  @Auth(AuthType.None)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: Number })
  async findById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findUserById(id);
    return {
      success: true,
      message: 'User fetched successfully',
      data: user,
    };
  }
}

import { Controller, Post, Get, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MemberService } from './services/member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Members')
@Controller('api/v1/members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new member' })
  async create(@Body() createMemberDto: CreateMemberDto) {
    const member = await this.memberService.create(createMemberDto);
    return {
      success: true,
      message: 'Member created successfully',
      data: member,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all members' })
  async findAll() {
    const members = await this.memberService.findAll();
    return {
      success: true,
      message: 'Members retrieved successfully',
      data: members,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get member by ID' })
  async findOne(@Param('id') id: number) {
    const member = await this.memberService.findOne(id);
    return {
      success: true,
      message: 'Member retrieved successfully',
      data: member,
    };
  }
}
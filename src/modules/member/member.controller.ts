import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { MemberService } from "./services/member.service";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../../common/enum/roles.enum";

@ApiTags("Members")
@ApiBearerAuth()
@Controller("api/v1/members")
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  @Roles(Role.MEMBER)
  @ApiOperation({ summary: "Get all members (MEMBER only)" })
  async findAll() {
    const members = await this.memberService.findAll();
    return { success: true, message: "Members retrieved successfully", data: members };
  }

  @Get(":id")
  @Roles(Role.MEMBER)
  @ApiOperation({ summary: "Get member by ID (MEMBER only)" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const member = await this.memberService.findOne(id);
    return { success: true, message: "Member retrieved successfully", data: member };
  }
}

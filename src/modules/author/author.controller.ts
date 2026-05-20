import { Controller, Get, Post, Body, Param, ParseIntPipe } from "@nestjs/common";
import { AuthorService } from "./services/author.service";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { Auth } from "../auth/decorators/auth.decorator";
import { AuthType } from "../auth/enum/auth-type.enum";

@ApiTags("Authors")
@ApiBearerAuth()
@Controller("api/v1/authors")
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  @Auth(AuthType.None) 
  @ApiOperation({ summary: "Get all authors" })
  async findAll() {
    const authors = await this.authorService.findAll();
    return { success: true, message: "Authors fetched successfully", data: authors };
  }

  @Get(":id")
  @Auth(AuthType.None)
  @ApiOperation({ summary: "Get author by ID" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const author = await this.authorService.findByUserId(id);
    return { success: true, message: "Author fetched successfully", data: author };
  }
}

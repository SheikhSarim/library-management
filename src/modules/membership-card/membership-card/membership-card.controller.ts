import {
  Controller,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Membership Cards')
@Controller('api/v1/membership-cards')
export class MembershipCardController {}

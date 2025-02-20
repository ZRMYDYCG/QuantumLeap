import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { CreateUserVo } from './vo/create-user.vo'
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { LoginDto } from './dto/login.dto'
import { Public } from '../public/public.decorator'

@ApiTags('用户模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiOkResponse({ description: '返回示例', type: CreateUserVo })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Public()
  @Post('login')
  login(@Body() LoginDto: LoginDto) {
    return this.userService.login(LoginDto)
  }

  @Public()
  @Get('captcha')
  getCaptcha() {
    return this.userService.getCaptcha()
  }
}

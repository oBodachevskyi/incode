import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  Put,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './guard/auth.guard';
import { User } from './decorators/user.decorator';
import { UserEntity } from './user.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user')
    createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
    if (user.role === 'ADMINISTRATOR')
      return await this.userService.buildUserAdminResponse(user);

    if (user.role === 'BOSS') {
      return await this.userService.buildUserBossResponse(user);
    }

    if (user.role === 'REGULAR') {
      return await this.userService.buildUserRegularResponse(user);
    }

    return this.userService.buildUserResponse(user);
  }

  @Put('user/:regularId/:bossId')
  @UseGuards(AuthGuard)
  async changeBoss(
    @User() user: UserEntity,
    @Param('regularId') regularId: number,
    @Param('bossId') bossId: number,
  ): Promise<UserResponseInterface> {
    const updatedUser = await this.userService.changeBoss(
      user.id,
      regularId,
      bossId,
    );
    return this.userService.buildUserResponse(updatedUser);
  }
}

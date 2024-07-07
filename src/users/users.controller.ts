import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ApiTags} from '@nestjs/swagger'
import { Public } from 'src/decorator/public.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { Roles } from 'src/decorator/role.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @Public()
  async signup(@Body() body: CreateUserDto) {
    const response = await this.usersService.signup(body);
    return {
      status: 1,
      message: 'User created successfully',
      data: response,
    };
  }
  @Post('login')
  @Public()
  async login(@Body() body: LoginUserDto) {
    const response = await this.usersService.login(body);
    return {
      status: 1,
      message: 'Login Successful ',
      data: response,
    };
  }

  @Get()
  @Roles(Role.Admin)
  async findAll() {
    const data = await this.usersService.findAll();
    return {
      status: 1,
      message: 'User created successfully',
      data,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':guid')
  remove(@Param('guid') guid: string) {
    return this.usersService.remove(guid);
  }
}

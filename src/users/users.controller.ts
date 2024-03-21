import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignInDTO } from './dto/sign-in-dto';
import { Public } from 'src/decorator/public.decorator';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const token = await this.usersService.create(createUserDto);
    return {
      status: 4,
      message: 'User created successfully',
      data: {
        token,
      },
    };
  }

  @Get()
  async findAll() {
    const data = await this.usersService.findAll();
    return {
      message: 'All user fetched',
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  @Public()
  @Post('/sign-in')
  async signIn(@Body() body: SignInDTO) {
    const token = await this.usersService.signIn(body);
    return {
      data: {
        message: 'Sign in success',
        data: { token },
      },
    };
  }
}

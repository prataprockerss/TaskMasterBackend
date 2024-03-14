import {
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { SignInDTO } from './dto/sign-in-dto';
import { JwtService} from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    @InjectRepository(User)
    readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await this.convertHashPassword(
      createUserDto.password,
    );
    const response = this.userRepository.save(createUserDto);
    return response;
  }

  findAll() {
    return this.userRepository.find({
      select: ['firstName', 'lastName', 'id', 'email', 'addedOn'],
    });
  }

  findOne(Params) {
    return this.userRepository.findOne({
      where: Params,
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    updateUserDto.updatedOn = new Date().toISOString();
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async signIn({ email, password }: SignInDTO) {
    const user = await this.findOne({ email });
    if (!user) {
      throw new UnauthorizedException();
    }

    const matchPass = await bcrypt.compare(password, user.password);

    if (!matchPass) {
      throw new UnauthorizedException();
    }

    const token = this.jwtService.sign({ email: user.email, id: user.id });

    return token;
  }

  async convertHashPassword(plainPassword: string): Promise<string> {
    return await bcrypt.hash(plainPassword, 10);
  }
}

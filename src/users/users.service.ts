import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { SignInDTO } from './dto/sign-in-dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

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
    createUserDto.guid = uuid();
    const { email, guid } = await this.userRepository.save(createUserDto);
    const token = this.signToken({
      email: email,
      userId: guid,
    });
    return token;
  }

  findAll() {
    return this.userRepository.find({
      select: ['firstName', 'lastName', 'guid', 'email', 'addedOn'],
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

    const token = this.signToken({ email: user.email, id: user.guid });

    return token;
  }

  async convertHashPassword(plainPassword: string): Promise<string> {
    return await bcrypt.hash(plainPassword, 10);
  }

  signToken(payload) {
    return this.jwtService.sign(payload);
  }
}

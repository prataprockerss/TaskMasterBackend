import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { ROLE_ID } from './constants';
import { UserRoles } from './entities/userRole.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(UserRoles)
    private userRolesRepo: Repository<UserRoles>,
    
    private jwtService: JwtService,

    private configService: ConfigService
  ) {}
  async signup(properties: CreateUserDto) {
    const hashPassword = await bcrypt.hash(properties.password, 10);
    const userGuid = uuidv4();

    const user = this.userRepo.create({
      guid: userGuid,
      email: properties.email,
      mobile: properties.mobile,
      password: hashPassword,
      created_by: userGuid,
      username: properties.username,
    });

    await this.userRepo.save(user);
    

    const userRoles = [];

    userRoles.push(
      this.userRolesRepo.create({
        role_id: ROLE_ID.USER,
        user_guid: user.guid,
        created_by: user.guid,
      }),
    );

    await this.userRolesRepo.save(userRoles);
    
    return {
      success: 1,
    };
  }

  async findAll() {
    return await this.userRepo.createQueryBuilder('user')
    .leftJoinAndSelect('user.roles', 'userRoles')
    .leftJoinAndSelect('userRoles.role', 'role')
    .select([
      'user.guid',
      'user.email',
      'user.mobile',
      'user.username',
      'userRoles.id',  
      'role.id',
      'role.role',
    ])
    .getMany()

  }

  async findOne(id: number) {
    return await this.userRepo.createQueryBuilder('user')
    .leftJoinAndSelect('user.roles', 'userRoles')
    .leftJoinAndSelect('userRoles.role', 'role')
    .select([
      'user.guid',
      'user.email',
      'user.mobile',
      'user.username',
      'userRoles.id',  
      'role.id',
      'role.role',
    ])
    .where({
      guid: id
    })
    .getOne()
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async login(body:LoginUserDto) {
    // find user 
    const user = await this.userRepo.findOne({
      where: {
        email: body.email
      }
    })
    // verify password
    const isValidPassword = await bcrypt.compare(body.password,user.password)
    if(!isValidPassword) {
      throw new UnauthorizedException('Email or password is wrong')
    }
    // return jwt token 
    const token = await this.jwtService.sign({
      id: user.guid,
      roles: user.roles
    },{secret: this.configService.get('SECRET_KEY')})
    return {
      token
    };
  }

  async remove(id: string) {
    return await this.userRepo.delete({ guid: id });
  }
}

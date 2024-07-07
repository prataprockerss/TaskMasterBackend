import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoles } from './entities/userRole.entity';
import { Role } from './entities/role.entitiy';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRoles,Role]),],
  controllers: [UsersController],
  providers: [UsersService,JwtService],
  exports : [UsersService]
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD,APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from 'src/guards/auth.guards';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: 'TEST',
      signOptions: {
        expiresIn: '10m',
      },
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ],
  exports: [UsersService],
})
export class UsersModule {}

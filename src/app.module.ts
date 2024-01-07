import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DbService } from './config/db.service';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService, DbService],
})
export class AppModule { }

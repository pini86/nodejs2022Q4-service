import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DBModule } from '../db/db.module';

@Module({
  imports: [DBModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

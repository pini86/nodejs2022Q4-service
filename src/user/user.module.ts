import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RepositoryUsersStorage } from './store/repository.users.storage';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: 'UsersStore', useClass: RepositoryUsersStorage },
    { provide: 'APP_GUARD', useClass: JwtAuthGuard },
  ],
  exports: [UsersService],
})
export class UsersModule {}

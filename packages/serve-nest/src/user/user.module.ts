import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Role } from '../role/entities/role.entity'
import { APP_GUARD } from '@nestjs/core'
import { UserGuard } from './user.guard'
import { CacheModule } from '../cache/cache.module'

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: UserGuard,
    },
  ],
  imports: [TypeOrmModule.forFeature([User, Role]), CacheModule],
})
export class UserModule {}

import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { User } from './user/entities/user.entity'
import { Menu } from './menu/entities/menu.entity'
import { Role } from './role/entities/role.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as path from 'path'
import { JwtModule } from '@nestjs/jwt'
import { CacheModule } from './cache/cache.module'
import { MenuModule } from './menu/menu.module'
import { RoleModule } from './role/role.module'

const isProd = process.env.NODE_ENV === 'production'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        isProd
          ? path.resolve('.env.prod')
          : path.resolve('.env.development.local'),
      ],
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          connectorPackage: 'mysql2', // 驱动包
          port: configService.get('DB_PORT'), // 端口号
          username: configService.get('DB_USERNAME'), // 用户名
          password: configService.get('DB_PASSWORD'), // 密码
          database: configService.get('DB_DATABASE'), // 数据库名
          entities: [User, Menu, Role], // 数据库对应的Entity
          autoLoadEntities: true, // 自动加载实体
          synchronize: !isProd, // 是否自动同步实体文件,生产环境下关闭
        }
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: configService.get('JWT_EXPIRATION_TIME') },
        }
      },
    }),
    UserModule,
    CacheModule,
    MenuModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

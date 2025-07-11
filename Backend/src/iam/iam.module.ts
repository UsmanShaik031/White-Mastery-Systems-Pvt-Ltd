import { Module } from '@nestjs/common';
import { HashingService } from './guards/role/hashing/hashing.service';
import { BcryptService } from './guards/role/hashing/bcrypt.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';
import { AuthGuard } from './guards/auth/auth.guard';
import { RefreshTokenIdsStorage } from './storage/refresh-token-ids.storage/refresh-token-ids.storage';
import { RoleGuard } from './guards/role/role.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
    AccessTokenGuard,
    RefreshTokenIdsStorage,
    AuthService,
  ],
  controllers: [AuthController],
})
export class IamModule {}

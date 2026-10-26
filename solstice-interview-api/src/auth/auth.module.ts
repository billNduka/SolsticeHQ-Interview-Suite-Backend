import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { OauthController } from './oauth.controller.js';

@Module({
  controllers: [AuthController, OauthController],
  providers: [AuthService]
})
export class AuthModule {}

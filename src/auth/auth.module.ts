import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';

import { MongooseModule } from '@nestjs/mongoose';
import userSchema, { User } from 'src/models/User.model';
import { PassportModule } from '@nestjs/passport';
import { Hashing } from 'src/utils/encode';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from 'src/utils/localStrategy';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
    JwtModule.register({
      secret: 'randomKey',
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

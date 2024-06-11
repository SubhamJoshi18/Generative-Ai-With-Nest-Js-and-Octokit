import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtItem {
  constructor(private readonly jwtService: JwtService) {}

  // for generate token it will take secret and time from app.modulw that
  // that we have imported in imports JwtModule.register
  async _generateTokenGlobal(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  // for generate token with specific expiry time
  async _generateTokenWithValidity(
    payload: any,
    expiry: string | number,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn: expiry });
  }

  // verify token
  async _verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
}

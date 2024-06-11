import { AuthService } from './../../services/auth/auth.service';
import {
  Controller,
  Post,
  Body,
  Inject,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from 'src/auth/dtos/loginDto';
import { postTokenDto } from 'src/auth/dtos/postTokenDto';
import { registerDto } from 'src/auth/dtos/registerDto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() registerDto: registerDto) {
    try {
      const response = await this.authService.registerUser(registerDto);
      return response;
    } catch (error: Error | any) {
      return {
        message: error.message,
      };
    }
  }
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() { username, password }: LoginDto) {
    try {
      const response = await this.authService.loginUser({ username, password });
      return response;
    } catch (error: Error | any) {
      let message = { error: error.message };
      if (error instanceof Error) {
        console.log(error);
        if (error instanceof Error) {
          message.error = error.message;
        }

        return message;
      }
    }
  }
}

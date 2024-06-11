import { IsEmail, IsNotEmpty, IsSemVer, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

import { IsEmail, IsNotEmpty, IsSemVer, IsString } from 'class-validator';

export class registerDto {
  @IsString()
  username: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

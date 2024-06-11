import { IsNotEmpty } from 'class-validator';

export class postTokenDto {
  @IsNotEmpty()
  token: string;
}

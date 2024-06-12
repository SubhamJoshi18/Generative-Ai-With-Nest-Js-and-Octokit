import { IsNotEmpty } from 'class-validator';

export class PullRequestDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  body: string;

  @IsNotEmpty()
  head: string;

  @IsNotEmpty()
  base: string;
}

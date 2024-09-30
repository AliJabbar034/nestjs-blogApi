import { IsEmail, IsNotEmpty, IsString, Min, MIN } from 'class-validator';

export class loginUserDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Min(6)
  password: string;
}

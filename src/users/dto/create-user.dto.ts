import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, isString } from "class-validator"

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string
  
  @IsOptional()
  @IsNumber()
  mobile?: number

  @IsOptional()
  @IsString()
  username: string

  @IsOptional()
  @IsString()
  password: string

  @IsBoolean()
  isArtist: boolean
  
}

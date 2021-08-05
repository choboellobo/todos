import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class loginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string
}
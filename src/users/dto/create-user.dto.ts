import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from "class-validator"

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string
}

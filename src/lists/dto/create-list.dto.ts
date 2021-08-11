import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MinLength } from "class-validator"
import { ObjectId } from "mongoose"

export class CreateListDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name: string
}

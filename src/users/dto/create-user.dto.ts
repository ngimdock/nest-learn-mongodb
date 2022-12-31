import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  name: string;

  @IsNumber()
  @IsPositive()
  @Min(8)
  @Max(100)
  age: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  favoriteUnit?: string[];
}

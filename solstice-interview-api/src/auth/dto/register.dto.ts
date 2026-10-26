import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Email registration request defined by SDD section 9.2 and SRS FR-AUTH-01.
 */
export class RegisterDto {
  @ApiProperty({ description: 'Email address for the new account', example: 'jane@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Account password', example: 'correct-horse-battery-staple', minLength: 8, maxLength: 128 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @ApiProperty({ description: 'User full name', example: 'Jane Doe', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  fullName: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Password sign-in request defined by SDD section 9.2 and SRS FR-AUTH-05.
 */
export class LoginDto {
  @ApiProperty({ description: 'Account email address', example: 'jane@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Account password', example: 'correct-horse-battery-staple', minLength: 8, maxLength: 128 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}

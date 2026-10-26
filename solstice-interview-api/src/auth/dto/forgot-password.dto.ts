import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

/**
 * Password-reset request defined by SDD section 9.2 and SRS FR-AUTH-04.
 */
export class ForgotPasswordDto {
  @ApiProperty({ description: 'Email address for the password-reset message', example: 'jane@example.com' })
  @IsEmail()
  email: string;
}

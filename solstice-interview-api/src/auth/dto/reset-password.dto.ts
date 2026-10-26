import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Password reset request defined by SDD section 9.2 and SRS FR-AUTH-04.
 */
export class ResetPasswordDto {
  @ApiProperty({ description: 'Single-use password-reset token', example: 'reset-token-value' })
  @IsString()
  token: string;

  @ApiProperty({ description: 'New account password', example: 'correct-horse-battery-staple', minLength: 8, maxLength: 128 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  newPassword: string;
}

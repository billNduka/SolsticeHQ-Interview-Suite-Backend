import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Password change request defined by SDD section 9.4 and SRS FR-AUTH-09.
 */
export class ChangePasswordDto {
  @ApiPropertyOptional({ description: 'Current password, required when the account already has one', example: 'old-password-value', minLength: 8, maxLength: 128 })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  currentPassword?: string;

  // TODO(spec): password rules are proposed | assumed: 8 to 128 characters
  @ApiProperty({ description: 'New account password', example: 'new-password-value', minLength: 8, maxLength: 128 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  newPassword: string;
}

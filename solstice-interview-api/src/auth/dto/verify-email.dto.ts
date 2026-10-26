import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * Email verification request defined by SDD section 9.2 and SRS FR-AUTH-01.
 */
export class VerifyEmailDto {
  @ApiProperty({ description: 'Single-use email verification token', example: 'verification-token-value' })
  @IsString()
  token: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

/**
 * Verification-email resend request defined by SDD section 9.2 and SRS FR-AUTH-01a.
 */
export class ResendVerificationDto {
  @ApiProperty({ description: 'Email address to send the verification link to', example: 'jane@example.com' })
  @IsEmail()
  email: string;
}

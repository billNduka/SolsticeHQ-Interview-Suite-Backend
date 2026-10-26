import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * Google sign-in request defined by SDD sections 5.3 and 9.3 and SRS FR-AUTH-02.
 */
export class GoogleSignInDto {
  @ApiProperty({ description: 'Google ID token', example: 'google-id-token-value' })
  @IsString()
  idToken: string;
}

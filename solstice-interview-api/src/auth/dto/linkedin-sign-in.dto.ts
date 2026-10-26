import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * LinkedIn authorization-code sign-in request defined by SDD sections 5.3 and 9.3 and SRS FR-AUTH-02.
 */
export class LinkedInSignInDto {
  @ApiProperty({ description: 'LinkedIn authorization code', example: 'linkedin-authorization-code' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'OAuth redirect URI used for the browser flow', example: 'https://app.example.com/auth/callback' })
  @IsString()
  redirectUri: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * Facebook sign-in request defined by SDD sections 5.3 and 9.3 and SRS FR-AUTH-02.
 */
export class FacebookSignInDto {
  @ApiProperty({ description: 'Facebook access token', example: 'facebook-access-token-value' })
  @IsString()
  accessToken: string;
}

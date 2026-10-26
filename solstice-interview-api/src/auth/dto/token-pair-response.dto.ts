import { ApiProperty } from '@nestjs/swagger';

/**
 * Access and refresh token pair returned by token refresh, defined by SDD section 9.2.
 */
export class TokenPairResponseDto {
  @ApiProperty({ description: 'Short-lived access token', example: 'access-token-value' })
  accessToken: string;

  @ApiProperty({ description: 'Rotated opaque refresh token', example: 'refresh-token-value' })
  refreshToken: string;
}

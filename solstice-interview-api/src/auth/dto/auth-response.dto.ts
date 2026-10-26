import { ApiProperty } from '@nestjs/swagger';

import { UserResponseDto } from '../../users/dto/user-response.dto.js';

/**
 * Authentication response shared by password and social sign-in, defined by SDD sections 5 and 9.2.
 */
export class AuthResponseDto {
  @ApiProperty({ description: 'Short-lived access token', example: 'access-token-value' })
  accessToken: string;

  @ApiProperty({ description: 'Opaque refresh token', example: 'refresh-token-value' })
  refreshToken: string;

  @ApiProperty({ description: 'Authenticated user account', type: UserResponseDto })
  user: UserResponseDto;
}

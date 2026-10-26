import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * Refresh-token request used by refresh and logout, as defined by SDD sections 5.1 and 9.2.
 */
export class RefreshTokenDto {
  @ApiProperty({ description: 'Opaque refresh token', example: 'refresh-token-value' })
  @IsString()
  refreshToken: string;
}

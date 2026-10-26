import { ApiProperty } from '@nestjs/swagger';

import { AuthProvider } from '../../common/enums/auth-provider.enum.js';

/**
 * Connected social identity representation defined by SDD section 9.4.
 */
export class IdentityResponseDto {
  @ApiProperty({ description: 'Social sign-in provider', enum: AuthProvider, enumName: 'AuthProvider', example: AuthProvider.Google })
  provider: AuthProvider;

  @ApiProperty({ description: 'Email reported by the provider, when available', nullable: true, example: 'jane@example.com' })
  email: string | null;

  @ApiProperty({ description: 'Timestamp when the identity was linked', format: 'date-time', example: '2026-10-26T13:00:00.000Z' })
  linkedAt: Date;
}

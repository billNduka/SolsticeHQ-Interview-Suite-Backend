import { ApiProperty } from '@nestjs/swagger';

/**
 * Generic message response used by action endpoints without a richer response body.
 */
export class MessageResponseDto {
  @ApiProperty({
    description: 'Human-readable result message',
    example: 'Verification email sent',
  })
  message: string;
}

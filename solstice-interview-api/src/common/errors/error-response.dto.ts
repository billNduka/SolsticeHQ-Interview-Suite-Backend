import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ErrorCode } from './error-codes.js';

/**
 * Standard API error response defined by SDD section 8.2.
 */
export class ErrorResponseDto {
  @ApiProperty({
    description: 'Machine-readable error code',
    enum: ErrorCode,
    enumName: 'ErrorCode',
    example: ErrorCode.ValidationError,
  })
  code: ErrorCode;

  @ApiProperty({
    description: 'Human-readable error message',
    example: 'The request contains invalid fields',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Additional error details when available',
    example: { field: 'email', reason: 'Must be a valid email address' },
    type: Object,
  })
  details?: Record<string, unknown>;
}

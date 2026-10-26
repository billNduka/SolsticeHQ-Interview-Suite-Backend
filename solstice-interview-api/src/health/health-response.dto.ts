import { ApiProperty } from '@nestjs/swagger';

/**
 * Liveness response for the system health endpoint defined by SDD section 9.1.
 */
export class HealthResponseDto {
  @ApiProperty({ description: 'Current service status', example: 'ok' })
  status: string;

  @ApiProperty({
    description: 'Response timestamp in ISO 8601 UTC format',
    format: 'date-time',
    example: '2026-10-26T13:00:00.000Z',
  })
  timestamp: string;
}

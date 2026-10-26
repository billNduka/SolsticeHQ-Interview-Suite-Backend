import { ApiProperty } from '@nestjs/swagger';

/**
 * Resume metadata representation defined by SDD sections 4.2 and 9.6.
 */
export class ResumeResponseDto {
  @ApiProperty({ description: 'Resume UUID', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ description: 'Resume title', example: 'Backend resume 2026' })
  title: string;

  @ApiProperty({ description: 'Uploaded file MIME type', example: 'application/pdf' })
  mimeType: string;

  @ApiProperty({ description: 'Uploaded file size in bytes', example: 245760 })
  sizeBytes: number;

  @ApiProperty({ description: 'Whether this is the user default resume', example: true })
  isDefault: boolean;

  @ApiProperty({ description: 'Upload timestamp in ISO 8601 UTC format', format: 'date-time', example: '2026-10-26T13:00:00.000Z' })
  createdAt: Date;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ApplicationStatus } from '../../common/enums/application-status.enum.js';

/**
 * Job application representation defined by SDD sections 4.2 and 9.8.
 */
export class ApplicationResponseDto {
  @ApiProperty({ description: 'Application UUID', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ description: 'Name of the company applied to', example: 'Shopify' })
  companyName: string;

  @ApiProperty({ description: 'Role title', example: 'Junior Backend Developer' })
  roleTitle: string;

  @ApiProperty({ description: 'Application status', enum: ApplicationStatus, enumName: 'ApplicationStatus', example: ApplicationStatus.Applied })
  status: ApplicationStatus;

  @ApiPropertyOptional({ description: 'Application submission date in ISO 8601 format', nullable: true, format: 'date-time', example: '2026-10-26T13:00:00.000Z' })
  appliedAt: Date | null;

  @ApiPropertyOptional({ description: 'Application notes', nullable: true, example: 'Referred by a former colleague' })
  notes: string | null;

  @ApiPropertyOptional({ description: 'Linked job description UUID', nullable: true, format: 'uuid', example: '650e8400-e29b-41d4-a716-446655440000' })
  jobDescriptionId: string | null;

  @ApiPropertyOptional({ description: 'Linked company UUID', nullable: true, format: 'uuid', example: '750e8400-e29b-41d4-a716-446655440000' })
  companyId: string | null;

  @ApiProperty({ description: 'Creation timestamp in ISO 8601 UTC format', format: 'date-time', example: '2026-10-26T13:00:00.000Z' })
  createdAt: Date;
}

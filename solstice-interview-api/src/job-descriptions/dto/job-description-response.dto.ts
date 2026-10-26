import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Saved job-description representation defined by SDD sections 4.2 and 9.7.
 */
export class JobDescriptionResponseDto {
  @ApiProperty({ description: 'Job description UUID', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ description: 'Job description title', example: 'Senior Backend Engineer' })
  title: string;

  @ApiPropertyOptional({ description: 'Company name, when supplied', nullable: true, example: 'Shopify' })
  companyName: string | null;

  @ApiProperty({ description: 'Saved job description text', example: 'Build reliable APIs and services for our customers.' })
  text: string;

  @ApiProperty({ description: 'Creation timestamp in ISO 8601 UTC format', format: 'date-time', example: '2026-10-26T13:00:00.000Z' })
  createdAt: Date;
}

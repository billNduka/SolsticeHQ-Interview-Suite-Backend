import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

import { ApplicationStatus } from '../../common/enums/application-status.enum.js';

/**
 * Job application creation request defined by SDD section 9.8 and SRS FR-TRK-01 through FR-TRK-04.
 */
export class CreateApplicationDto {
  @ApiProperty({ description: 'Name of the company applied to', example: 'Shopify', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  companyName: string;

  @ApiProperty({ description: 'Title of the role', example: 'Junior Backend Developer', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  roleTitle: string;

  @ApiPropertyOptional({ description: 'Application status. Defaults to saved.', enum: ApplicationStatus, enumName: 'ApplicationStatus', example: ApplicationStatus.Applied })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @ApiPropertyOptional({ description: 'Date the application was submitted in ISO 8601 format', format: 'date-time', example: '2026-10-26T13:00:00.000Z' })
  @IsOptional()
  @IsISO8601()
  appliedAt?: string;

  @ApiPropertyOptional({ description: 'Saved job description UUID', format: 'uuid', example: '650e8400-e29b-41d4-a716-446655440000' })
  @IsOptional()
  @IsUUID()
  jobDescriptionId?: string;

  @ApiPropertyOptional({ description: 'Company record UUID', format: 'uuid', example: '750e8400-e29b-41d4-a716-446655440000' })
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiPropertyOptional({ description: 'Free-text application notes', example: 'Referred by a former colleague' })
  @IsOptional()
  @IsString()
  notes?: string;
}

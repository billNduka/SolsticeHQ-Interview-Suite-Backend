import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

import { ExperienceLevel } from '../../common/enums/experience-level.enum.js';

/**
 * Career profile replacement request defined by SDD section 9.5 and SRS FR-PROF-01.
 */
export class UpsertCareerProfileDto {
  @ApiProperty({ description: 'Target role category UUID', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  targetRoleCategoryId: string;

  @ApiPropertyOptional({ description: 'Industry category UUID', format: 'uuid', example: '650e8400-e29b-41d4-a716-446655440000' })
  @IsOptional()
  @IsUUID()
  industryCategoryId?: string;

  @ApiProperty({ description: 'Career experience level', enum: ExperienceLevel, enumName: 'ExperienceLevel', example: ExperienceLevel.Mid })
  @IsEnum(ExperienceLevel)
  experienceLevel: ExperienceLevel;

  @ApiPropertyOptional({ description: 'Preferred work location', example: 'Toronto, Canada', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;
}

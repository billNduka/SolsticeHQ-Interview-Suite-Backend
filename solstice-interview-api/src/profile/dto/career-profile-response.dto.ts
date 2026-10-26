import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ExperienceLevel } from '../../common/enums/experience-level.enum.js';

/**
 * Career profile representation defined by SDD section 9.5 and SRS FR-PROF-01.
 */
export class CareerProfileResponseDto {
  @ApiProperty({ description: 'Profile UUID', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ description: 'Target role category UUID', format: 'uuid', example: '650e8400-e29b-41d4-a716-446655440000' })
  targetRoleCategoryId: string;

  @ApiPropertyOptional({ description: 'Industry category UUID', format: 'uuid', nullable: true, example: '750e8400-e29b-41d4-a716-446655440000' })
  industryCategoryId: string | null;

  @ApiProperty({ description: 'Target role category name', example: 'Backend Developer' })
  targetRoleCategoryName: string;

  @ApiPropertyOptional({ description: 'Industry category name', nullable: true, example: 'Technology' })
  industryCategoryName: string | null;

  @ApiProperty({ description: 'Career experience level', enum: ExperienceLevel, enumName: 'ExperienceLevel', example: ExperienceLevel.Mid })
  experienceLevel: ExperienceLevel;

  @ApiPropertyOptional({ description: 'Preferred work location', nullable: true, example: 'Toronto, Canada' })
  location: string | null;
}

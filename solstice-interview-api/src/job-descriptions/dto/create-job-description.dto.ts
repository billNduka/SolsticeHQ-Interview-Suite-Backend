import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Saved job-description request defined by SDD section 9.7 and SRS FR-DOC-03.
 */
export class CreateJobDescriptionDto {
  @ApiProperty({ description: 'Job description title', example: 'Senior Backend Engineer', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ description: 'Company name from the job description', example: 'Shopify', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyName?: string;

  @ApiProperty({ description: 'Pasted job description text', example: 'Build reliable APIs and services for our customers.' })
  @IsString()
  @IsNotEmpty()
  text: string;
}

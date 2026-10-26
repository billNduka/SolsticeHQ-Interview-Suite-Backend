import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Resume metadata update request defined by SDD section 9.6.
 */
export class UpdateResumeDto {
  @ApiPropertyOptional({ description: 'Updated resume title', example: 'Backend resume 2026', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ description: 'Whether this resume should be the default', example: true })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Resume upload form fields defined by SDD sections 7.2 and 9.6.
 */
export class UploadResumeDto {
  @ApiProperty({ description: 'PDF or DOCX resume file, maximum 5 MB', type: 'string', format: 'binary' })
  @IsNotEmpty()
  file: string;

  @ApiPropertyOptional({ description: 'Optional resume title', example: 'Backend resume 2026', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;
}

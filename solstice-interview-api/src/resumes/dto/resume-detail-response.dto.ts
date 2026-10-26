import { ApiProperty } from '@nestjs/swagger';

import { ResumeResponseDto } from './resume-response.dto.js';

/**
 * Detailed resume representation including extracted text, defined by SDD section 9.6.
 */
export class ResumeDetailResponseDto extends ResumeResponseDto {
  @ApiProperty({ description: 'Text extracted from the uploaded resume', example: 'Jane Doe\nBackend Developer' })
  extractedText: string;
}

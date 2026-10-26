import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

/**
 * Account profile update request defined by SDD section 9.4 and SRS FR-AUTH-07.
 */
export class UpdateMeDto {
  @ApiPropertyOptional({ description: 'Updated user full name', example: 'Jane Doe', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  fullName?: string;

  @ApiPropertyOptional({ description: 'Updated avatar image URL', example: 'https://cdn.example.com/avatars/jane.jpg' })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}

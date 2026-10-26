import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Apple sign-in request defined by SDD sections 5.3 and 9.3 and SRS FR-AUTH-02.
 */
export class AppleSignInDto {
  @ApiProperty({ description: 'Apple identity token', example: 'apple-identity-token-value' })
  @IsString()
  identityToken: string;

  @ApiPropertyOptional({ description: 'Full name supplied by Apple on first sign-in only', example: 'Jane Doe', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  fullName?: string;
}

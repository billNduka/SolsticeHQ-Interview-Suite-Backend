import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { ApplicationStatus } from '../../common/enums/application-status.enum.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';

/**
 * Paginated application list filters defined by SDD section 9.8.
 */
export class ListApplicationsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter applications by status', enum: ApplicationStatus, enumName: 'ApplicationStatus', example: ApplicationStatus.Interviewing })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;
}

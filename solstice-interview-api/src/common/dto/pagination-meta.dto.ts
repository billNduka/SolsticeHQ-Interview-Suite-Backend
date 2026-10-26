import { ApiProperty } from '@nestjs/swagger';

/**
 * Pagination metadata returned with list responses, as defined by SDD section 8.1.
 */
export class PaginationMetaDto {
  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Number of records requested per page', example: 20 })
  limit: number;

  @ApiProperty({ description: 'Total number of matching records', example: 42 })
  total: number;
}

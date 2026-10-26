import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { CategoryKind } from '../../common/enums/category-kind.enum.js';

/**
 * Category lookup filters defined by SDD section 9.5.
 */
export class ListCategoriesQueryDto {
  @ApiPropertyOptional({ description: 'Filter categories by kind', enum: CategoryKind, enumName: 'CategoryKind', example: CategoryKind.Role })
  @IsOptional()
  @IsEnum(CategoryKind)
  kind?: CategoryKind;
}

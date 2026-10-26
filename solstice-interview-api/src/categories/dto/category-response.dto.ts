import { ApiProperty } from '@nestjs/swagger';

import { CategoryKind } from '../../common/enums/category-kind.enum.js';

/**
 * Active category representation defined by SDD sections 4.2 and 9.5.
 */
export class CategoryResponseDto {
  @ApiProperty({ description: 'Category UUID', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ description: 'Category display name', example: 'Backend Developer' })
  name: string;

  @ApiProperty({ description: 'Category kind', enum: CategoryKind, enumName: 'CategoryKind', example: CategoryKind.Role })
  kind: CategoryKind;
}

// Stub phase: remove when implemented
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, NotImplementedException, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { ApiErrorResponses } from '../common/swagger/api-error-responses.decorator.js';
import { CategoryKind } from '../common/enums/category-kind.enum.js';
import { ErrorCode } from '../common/errors/error-codes.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { CategoryResponseDto } from './dto/category-response.dto.js';
import { ListCategoriesQueryDto } from './dto/list-categories-query.dto.js';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
	/**
	 * List active role and industry categories.
	 * SRS FR-PROF-01 · SDD §9.5
	 */
	@Get()
	@ApiOperation({
		summary: 'List categories',
		description: '**Access:** User\n**Requirements:** FR-PROF-01\n\nReturns active categories for role and industry pickers. The response is intentionally not paginated because the lists are short.',
	})
	@ApiQuery({ name: 'kind', description: 'Optional category kind filter', enum: CategoryKind, enumName: 'CategoryKind', required: false })
	@ApiOkResponse({ type: [CategoryResponseDto] })
	@ApiErrorResponses(ErrorCode.Unauthenticated, ErrorCode.ValidationError)
	listCategories(@Query() query: ListCategoriesQueryDto, @CurrentUser() user: AuthenticatedUser): Promise<CategoryResponseDto[]> {
		throw new NotImplementedException();
	}
}

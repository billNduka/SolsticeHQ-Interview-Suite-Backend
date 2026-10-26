// Stub phase: remove when implemented
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, NotImplementedException, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { ApiErrorResponses } from '../common/swagger/api-error-responses.decorator.js';
import { ApiPaginatedResponse } from '../common/swagger/api-paginated-response.decorator.js';
import { ErrorCode } from '../common/errors/error-codes.js';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js';
import { PaginationMetaDto } from '../common/dto/pagination-meta.dto.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { CreateJobDescriptionDto } from './dto/create-job-description.dto.js';
import { JobDescriptionResponseDto } from './dto/job-description-response.dto.js';

@ApiTags('Job descriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('job-descriptions')
export class JobDescriptionsController {
	/**
	 * Save a pasted job description.
	 * SRS FR-DOC-03 · SDD §9.7
	 */
	@Post()
	@ApiOperation({
		summary: 'Save a job description',
		description: '**Access:** User\n**Requirements:** FR-DOC-03\n\nSaves pasted job-description text for the signed-in user.',
	})
	@ApiCreatedResponse({ type: JobDescriptionResponseDto })
	@ApiErrorResponses(ErrorCode.Unauthenticated, ErrorCode.ValidationError)
	createJobDescription(@Body() dto: CreateJobDescriptionDto, @CurrentUser() user: AuthenticatedUser): Promise<JobDescriptionResponseDto> {
		throw new NotImplementedException();
	}

	/**
	 * List saved job descriptions.
	 * SRS FR-DOC-03 · SDD §9.7
	 */
	@Get()
	@ApiOperation({
		summary: 'List job descriptions',
		description: "**Access:** User\n**Requirements:** FR-DOC-03\n\nReturns the signed-in user's saved job descriptions in a paginated envelope.",
	})
	@ApiPaginatedResponse(JobDescriptionResponseDto)
	@ApiErrorResponses(ErrorCode.Unauthenticated, ErrorCode.ValidationError)
	listJobDescriptions(@Query() query: PaginationQueryDto, @CurrentUser() user: AuthenticatedUser): Promise<{ data: JobDescriptionResponseDto[]; meta: PaginationMetaDto }> {
		throw new NotImplementedException();
	}

	/**
	 * Get one saved job description.
	 * SRS FR-DOC-03 · SDD §9.7
	 */
	@Get(':id')
	@ApiOperation({
		summary: 'Get a job description',
		description: '**Access:** User\n**Requirements:** FR-DOC-03\n\nReturns one saved job description after an ownership check.',
	})
	@ApiParam({ name: 'id', description: 'Job description UUID', format: 'uuid' })
	@ApiOkResponse({ type: JobDescriptionResponseDto })
	@ApiErrorResponses(ErrorCode.Unauthenticated, ErrorCode.ValidationError, ErrorCode.NotFound)
	getJobDescription(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthenticatedUser): Promise<JobDescriptionResponseDto> {
		throw new NotImplementedException();
	}

	/**
	 * Delete a saved job description.
	 * SRS FR-DOC-04 · SDD §9.7
	 */
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete a job description',
		description: '**Access:** User\n**Requirements:** FR-DOC-04\n\nDeletes the saved job description. Linked matches, interviews, and applications remain.',
	})
	@ApiParam({ name: 'id', description: 'Job description UUID', format: 'uuid' })
	@ApiNoContentResponse()
	@ApiErrorResponses(ErrorCode.Unauthenticated, ErrorCode.ValidationError, ErrorCode.NotFound)
	deleteJobDescription(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthenticatedUser): Promise<void> {
		throw new NotImplementedException();
	}
}

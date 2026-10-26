// Stub phase: remove when implemented
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, NotImplementedException, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { ApiErrorResponses } from '../common/swagger/api-error-responses.decorator.js';
import { ApiPaginatedResponse } from '../common/swagger/api-paginated-response.decorator.js';
import { ApplicationStatus } from '../common/enums/application-status.enum.js';
import { ErrorCode } from '../common/errors/error-codes.js';
import { PaginationMetaDto } from '../common/dto/pagination-meta.dto.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { ApplicationResponseDto } from './dto/application-response.dto.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { ListApplicationsQueryDto } from './dto/list-applications-query.dto.js';
import { UpdateApplicationDto } from './dto/update-application.dto.js';

@ApiTags('Application tracker')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
	/**
	 * Add a job application to the tracker.
	 * SRS FR-TRK-01, FR-TRK-02, FR-TRK-04 · SDD §9.8
	 */
	@Post()
	@ApiOperation({
		summary: 'Add an application',
		description: '**Access:** User\n**Requirements:** FR-TRK-01, FR-TRK-02, FR-TRK-04\n\nAdds a job application for the signed-in user and optionally links it to a saved job description or company.\n\n**Rules:** `status` defaults to `saved`.',
	})
	@ApiCreatedResponse({ type: ApplicationResponseDto })
	@ApiErrorResponses(ErrorCode.Unauthenticated, ErrorCode.ValidationError)
	createApplication(@Body() dto: CreateApplicationDto, @CurrentUser() user: AuthenticatedUser): Promise<ApplicationResponseDto> {
		throw new NotImplementedException();
	}

	/**
	 * List tracked applications.
	 * SRS FR-TRK-01, FR-TRK-02, FR-TRK-03 · SDD §9.8
	 */
	@Get()
	@ApiOperation({
		summary: 'List tracked applications',
		description: "**Access:** User\n**Requirements:** FR-TRK-01, FR-TRK-02, FR-TRK-03\n\nReturns the signed-in user's applications in a paginated envelope and supports filtering by status.",
	})
	@ApiQuery({ name: 'status', description: 'Optional application status filter', enum: ApplicationStatus, enumName: 'ApplicationStatus', required: false })
	@ApiPaginatedResponse(ApplicationResponseDto)
	@ApiErrorResponses(ErrorCode.Unauthenticated, ErrorCode.ValidationError)
	listApplications(@Query() query: ListApplicationsQueryDto, @CurrentUser() user: AuthenticatedUser): Promise<{ data: ApplicationResponseDto[]; meta: PaginationMetaDto }> {
		throw new NotImplementedException();
	}

	/**
	 * Get one tracked application.
	 * SRS FR-TRK-01 · SDD §9.8
	 */
	@Get(':id')
	@ApiOperation({
		summary: 'Get an application',
		description: '**Access:** User\n**Requirements:** FR-TRK-01\n\nReturns one application after an ownership check.',
	})
	@ApiParam({ name: 'id', description: 'Application UUID', format: 'uuid' })
	@ApiOkResponse({ type: ApplicationResponseDto })
	@ApiErrorResponses(ErrorCode.Unauthenticated, ErrorCode.ValidationError, ErrorCode.NotFound)
	getApplication(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthenticatedUser): Promise<ApplicationResponseDto> {
		throw new NotImplementedException();
	}

	/**
	 * Update application details or status.
	 * SRS FR-TRK-01, FR-TRK-02 · SDD §9.8
	 */
	@Patch(':id')
	@ApiOperation({
		summary: 'Update an application',
		description: '**Access:** User\n**Requirements:** FR-TRK-01, FR-TRK-02\n\nUpdates application details or changes its status, for example `{ "status": "interviewing" }`.',
	})
	@ApiParam({ name: 'id', description: 'Application UUID', format: 'uuid' })
	@ApiOkResponse({ type: ApplicationResponseDto })
	@ApiErrorResponses(ErrorCode.Unauthenticated, ErrorCode.ValidationError, ErrorCode.NotFound)
	updateApplication(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateApplicationDto, @CurrentUser() user: AuthenticatedUser): Promise<ApplicationResponseDto> {
		throw new NotImplementedException();
	}

	/**
	 * Delete a tracked application.
	 * SRS FR-TRK-01 · SDD §9.8
	 */
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete an application',
		description: "**Access:** User\n**Requirements:** FR-TRK-01\n\nDeletes the signed-in user's application record.",
	})
	@ApiParam({ name: 'id', description: 'Application UUID', format: 'uuid' })
	@ApiNoContentResponse()
	@ApiErrorResponses(ErrorCode.Unauthenticated, ErrorCode.ValidationError, ErrorCode.NotFound)
	deleteApplication(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthenticatedUser): Promise<void> {
		throw new NotImplementedException();
	}
}

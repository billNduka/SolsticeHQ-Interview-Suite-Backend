// Stub phase: remove when implemented
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Put, NotImplementedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { ApiErrorResponses } from '../common/swagger/api-error-responses.decorator.js';
import { ErrorCode } from '../common/errors/error-codes.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { CareerProfileResponseDto } from './dto/career-profile-response.dto.js';
import { UpsertCareerProfileDto } from './dto/upsert-career-profile.dto.js';

@ApiTags('Career profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/me/profile')
export class ProfileController {
	/**
	 * Get the signed-in user's career profile.
	 * SRS FR-PROF-01, FR-PROF-02 · SDD §9.5
	 */
	@Get()
	@ApiOperation({
		summary: 'Get the career profile',
		description: "**Access:** User\n**Requirements:** FR-PROF-01, FR-PROF-02\n\nReturns the signed-in user's target role, industry, experience level, and location, including category names for display.",
	})
	@ApiOkResponse({ type: CareerProfileResponseDto })
	@ApiErrorResponses(ErrorCode.Unauthenticated, ErrorCode.NotFound)
	getCareerProfile(@CurrentUser() user: AuthenticatedUser): Promise<CareerProfileResponseDto> {
		throw new NotImplementedException();
	}

	/**
	 * Create or replace the signed-in user's career profile.
	 * SRS FR-PROF-01, FR-PROF-02 · SDD §9.5
	 */
	@Put()
	@ApiOperation({
		summary: 'Save the career profile',
		description: "**Access:** User\n**Requirements:** FR-PROF-01, FR-PROF-02\n\nCreates or replaces the signed-in user's career profile for use by downstream AI features.",
	})
	@ApiOkResponse({ type: CareerProfileResponseDto })
	@ApiErrorResponses(ErrorCode.Unauthenticated, ErrorCode.ValidationError)
	upsertCareerProfile(@Body() dto: UpsertCareerProfileDto, @CurrentUser() user: AuthenticatedUser): Promise<CareerProfileResponseDto> {
		throw new NotImplementedException();
	}
}

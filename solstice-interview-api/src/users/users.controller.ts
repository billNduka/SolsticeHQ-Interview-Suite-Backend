// Stub phase: remove when implemented
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Body,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	NotImplementedException,
	Param,
	Patch,
	Get,
	ParseEnumPipe,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiNoContentResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { ApiErrorResponses } from '../common/swagger/api-error-responses.decorator.js';
import { AuthProvider } from '../common/enums/auth-provider.enum.js';
import { ErrorCode } from '../common/errors/error-codes.js';
import type { AuthenticatedUser } from '../common/types/authenticated-user.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { UseGuards } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { IdentityResponseDto } from './dto/identity-response.dto.js';
import { UpdateMeDto } from './dto/update-me.dto.js';
import { UserResponseDto } from './dto/user-response.dto.js';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/me')
export class UsersController {
	/**
	 * Get the signed-in user's account.
	 * SRS FR-AUTH-05 · SDD §9.4
	 */
	@Get()
	@ApiOperation({
		summary: 'Get the current user',
		description: '**Access:** User\n**Requirements:** FR-AUTH-05\n\nReturns account information, role, and whether a password is configured.',
	})
	@ApiOkResponse({ type: UserResponseDto })
	@ApiErrorResponses(ErrorCode.Unauthenticated)
	getCurrentUser(@CurrentUser() user: AuthenticatedUser): Promise<UserResponseDto> {
		throw new NotImplementedException();
	}

	/**
	 * Update the signed-in user's account details.
	 * SDD §9.4
	 */
	@Patch()
	@ApiOperation({
		summary: 'Update the current user',
		description: '**Access:** User\n\nUpdates the signed-in user name or avatar URL.',
	})
	@ApiOkResponse({ type: UserResponseDto })
	@ApiErrorResponses(ErrorCode.Unauthenticated, ErrorCode.ValidationError)
	updateCurrentUser(@Body() dto: UpdateMeDto, @CurrentUser() user: AuthenticatedUser): Promise<UserResponseDto> {
		throw new NotImplementedException();
	}

	/**
	 * Change or set the signed-in user's password.
	 * SRS FR-AUTH-09 · SDD §9.4
	 */
	@Patch('password')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Change the password',
		description: '**Access:** User\n**Requirements:** FR-AUTH-09\n\nChanges or sets the password for the signed-in user.\n\n**Rules:** `currentPassword` is required only when the account already has a password.\n\n**Error note:** The SDD does not define a distinct wrong-current-password code; `VALIDATION_ERROR` is used for that case.',
	})
	@ApiNoContentResponse()
	@ApiErrorResponses(ErrorCode.Unauthenticated, ErrorCode.ValidationError)
	changePassword(@Body() dto: ChangePasswordDto, @CurrentUser() user: AuthenticatedUser): Promise<void> {
		// TODO(spec): no dedicated wrong-current-password error code is defined | assumed: VALIDATION_ERROR
		throw new NotImplementedException();
	}

	/**
	 * Delete the signed-in user's account and data.
	 * SRS FR-AUTH-07 · SDD §9.4
	 */
	@Delete()
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Delete the current user',
		description: "**Access:** User\n**Requirements:** FR-AUTH-07\n\nDeletes the account and all data, including resume files in storage. This supports Apple's App Store account-deletion requirement.",
	})
	@ApiNoContentResponse()
	@ApiErrorResponses(ErrorCode.Unauthenticated)
	deleteCurrentUser(@CurrentUser() user: AuthenticatedUser): Promise<void> {
		throw new NotImplementedException();
	}

	/**
	 * List connected social identities.
	 * SRS FR-AUTH-08 · SDD §9.4
	 */
	@Get('identities')
	@ApiOperation({
		summary: 'List connected identities',
		description: '**Access:** User\n**Requirements:** FR-AUTH-08\n\nReturns the social sign-in providers connected to the signed-in account.\n\n**Rules:** This response is not paginated because the number of identities is small.',
	})
	@ApiOkResponse({ type: [IdentityResponseDto] })
	@ApiErrorResponses(ErrorCode.Unauthenticated)
	listIdentities(@CurrentUser() user: AuthenticatedUser): Promise<IdentityResponseDto[]> {
		// TODO(spec): identity-list pagination is undefined | assumed: non-paginated array
		throw new NotImplementedException();
	}

	/**
	 * Unlink a social identity.
	 * SRS FR-AUTH-08 · SDD §9.4
	 */
	@Delete('identities/:provider')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Unlink an identity',
		description: '**Access:** User\n**Requirements:** FR-AUTH-08\n\nUnlinks a social sign-in provider from the signed-in account.\n\n**Rules:** The operation is blocked if it would leave the user with no identity and no password.',
	})
	@ApiParam({ name: 'provider', description: 'Social provider to unlink', enum: AuthProvider, enumName: 'AuthProvider' })
	@ApiNoContentResponse()
	@ApiErrorResponses(ErrorCode.Unauthenticated, ErrorCode.ValidationError, ErrorCode.InvalidState, ErrorCode.NotFound)
	unlinkIdentity(
		@Param('provider', new ParseEnumPipe(AuthProvider)) provider: AuthProvider,
		@CurrentUser() user: AuthenticatedUser,
	): Promise<void> {
		throw new NotImplementedException();
	}
}

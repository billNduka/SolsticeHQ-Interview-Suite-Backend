// Stub phase: remove when implemented
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, HttpCode, HttpStatus, NotImplementedException, Post } from '@nestjs/common';
import {
	ApiCreatedResponse,
	ApiOkResponse,
	ApiNoContentResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';

import { ApiErrorResponses } from '../common/swagger/api-error-responses.decorator.js';
import { MessageResponseDto } from '../common/dto/message-response.dto.js';
import { ErrorCode } from '../common/errors/error-codes.js';
import { AuthResponseDto } from './dto/auth-response.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { ResendVerificationDto } from './dto/resend-verification.dto.js';
import { TokenPairResponseDto } from './dto/token-pair-response.dto.js';
import { VerifyEmailDto } from './dto/verify-email.dto.js';

import { Public } from '../common/decorators/public.decorator.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	/**
	 * Create an email/password account.
	 * SRS FR-AUTH-01 · SDD §9.2
	 */
	@Post('register')
	@Public()
	@ApiOperation({
		summary: 'Register a user',
		description: '**Access:** Public\n**Requirements:** FR-AUTH-01\n\nCreates an account and sends a verification email.',
	})
	@ApiCreatedResponse({ type: MessageResponseDto })
	@ApiErrorResponses(ErrorCode.ValidationError, ErrorCode.Conflict, ErrorCode.RateLimited)
	registerUser(@Body() dto: RegisterDto): Promise<MessageResponseDto> {
		throw new NotImplementedException();
	}

	/**
	 * Confirm an email address.
	 * SRS FR-AUTH-01 · SDD §9.2
	 */
	@Post('verify-email')
	@HttpCode(HttpStatus.OK)
	@Public()
	@ApiOperation({
		summary: 'Verify an email',
		description: '**Access:** Public\n**Requirements:** FR-AUTH-01\n\nConfirms an email address using a single-use token.',
	})
	@ApiOkResponse({ type: MessageResponseDto })
	@ApiErrorResponses(ErrorCode.ValidationError, ErrorCode.InvalidToken, ErrorCode.RateLimited)
	verifyEmail(@Body() dto: VerifyEmailDto): Promise<MessageResponseDto> {
		throw new NotImplementedException();
	}

	/**
	 * Send a new verification email.
	 * SRS FR-AUTH-01a · SDD §9.2
	 */
	@Post('resend-verification')
	@HttpCode(HttpStatus.OK)
	@Public()
	@ApiOperation({
		summary: 'Resend a verification email',
		description: '**Access:** Public\n**Requirements:** FR-AUTH-01a\n\nSends a new verification email and always returns success without revealing whether the email exists.',
	})
	@ApiOkResponse({ type: MessageResponseDto })
	@ApiErrorResponses(ErrorCode.ValidationError, ErrorCode.RateLimited)
	resendVerificationEmail(@Body() dto: ResendVerificationDto): Promise<MessageResponseDto> {
		throw new NotImplementedException();
	}

	/**
	 * Sign in with an email and password.
	 * SRS FR-AUTH-05 · SDD §9.2
	 */
	@Post('login')
	@HttpCode(HttpStatus.OK)
	@Public()
	@ApiOperation({
		summary: 'Sign in with a password',
		description: '**Access:** Public\n**Requirements:** FR-AUTH-05\n\nReturns access and refresh tokens with the authenticated user.',
	})
	@ApiOkResponse({ type: AuthResponseDto })
	@ApiErrorResponses(ErrorCode.ValidationError, ErrorCode.InvalidCredentials, ErrorCode.EmailNotVerified, ErrorCode.AccountDisabled, ErrorCode.RateLimited)
	loginWithPassword(@Body() dto: LoginDto): Promise<AuthResponseDto> {
		throw new NotImplementedException();
	}

	/**
	 * Rotate a refresh token into a new token pair.
	 * SDD §§5.1, 9.2
	 */
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	@Public()
	@ApiOperation({
		summary: 'Refresh tokens',
		description: '**Access:** Public\n\nRotates the refresh token. Reuse of an old token revokes the whole token family.',
	})
	@ApiOkResponse({ type: TokenPairResponseDto })
	@ApiErrorResponses(ErrorCode.ValidationError, ErrorCode.Unauthenticated, ErrorCode.AccountDisabled, ErrorCode.RateLimited)
	refreshTokens(@Body() dto: RefreshTokenDto): Promise<TokenPairResponseDto> {
		throw new NotImplementedException();
	}

	/**
	 * Revoke a refresh token.
	 * SRS FR-AUTH-06 · SDD §9.2
	 */
	@Post('logout')
	@HttpCode(HttpStatus.NO_CONTENT)
	@Public()
	@ApiOperation({
		summary: 'Sign out a user',
		description: '**Access:** Public\n**Requirements:** FR-AUTH-06\n\nRevokes the supplied refresh token so logout works after the access token expires.',
	})
	@ApiNoContentResponse()
	@ApiErrorResponses(ErrorCode.ValidationError, ErrorCode.RateLimited)
	logoutUser(@Body() dto: RefreshTokenDto): Promise<void> {
		throw new NotImplementedException();
	}

	/**
	 * Send a password-reset email.
	 * SRS FR-AUTH-04 · SDD §9.2
	 */
	@Post('forgot-password')
	@HttpCode(HttpStatus.OK)
	@Public()
	@ApiOperation({
		summary: 'Request a password reset',
		description: '**Access:** Public\n**Requirements:** FR-AUTH-04\n\nSends a reset email and always returns success without revealing whether the email exists.',
	})
	@ApiOkResponse({ type: MessageResponseDto })
	@ApiErrorResponses(ErrorCode.ValidationError, ErrorCode.RateLimited)
	forgotPassword(@Body() dto: ForgotPasswordDto): Promise<MessageResponseDto> {
		throw new NotImplementedException();
	}

	/**
	 * Set a new password from a reset token.
	 * SRS FR-AUTH-04 · SDD §9.2
	 */
	@Post('reset-password')
	@HttpCode(HttpStatus.OK)
	@Public()
	@ApiOperation({
		summary: 'Reset a password',
		description: '**Access:** Public\n**Requirements:** FR-AUTH-04\n\nSets a new password and revokes all refresh tokens for the user.',
	})
	@ApiOkResponse({ type: MessageResponseDto })
	@ApiErrorResponses(ErrorCode.ValidationError, ErrorCode.InvalidToken, ErrorCode.RateLimited)
	resetPassword(@Body() dto: ResetPasswordDto): Promise<MessageResponseDto> {
		throw new NotImplementedException();
	}
}

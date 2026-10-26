// Stub phase: remove when implemented
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, HttpCode, HttpStatus, NotImplementedException, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '../common/decorators/public.decorator.js';
import { ApiErrorResponses } from '../common/swagger/api-error-responses.decorator.js';
import { ErrorCode } from '../common/errors/error-codes.js';
import { AppleSignInDto } from './dto/apple-sign-in.dto.js';
import { AuthResponseDto } from './dto/auth-response.dto.js';
import { FacebookSignInDto } from './dto/facebook-sign-in.dto.js';
import { GoogleSignInDto } from './dto/google-sign-in.dto.js';
import { LinkedInSignInDto } from './dto/linkedin-sign-in.dto.js';

@ApiTags('Auth: Social sign-in')
@Controller('auth/oauth')
export class OauthController {
	/**
	 * Sign in with Google.
	 * SRS FR-AUTH-02, FR-AUTH-03 · SDD §9.3
	 */
	@Post('google')
	@HttpCode(HttpStatus.OK)
	@Public()
	@ApiOperation({
		summary: 'Sign in with Google',
		description: '**Access:** Public\n**Requirements:** FR-AUTH-02, FR-AUTH-03\n\nVerifies the Google ID token and returns tokens with the user account. The audience must match one of our iOS, Android, or web client IDs. A new identity links to an existing account only when Google confirms the email is verified.',
	})
	@ApiOkResponse({ type: AuthResponseDto })
	@ApiErrorResponses(ErrorCode.ValidationError, ErrorCode.Unauthenticated, ErrorCode.AccountDisabled, ErrorCode.RateLimited)
	signInWithGoogle(@Body() dto: GoogleSignInDto): Promise<AuthResponseDto> {
		throw new NotImplementedException();
	}

	/**
	 * Sign in with Apple.
	 * SRS FR-AUTH-02, FR-AUTH-03 · SDD §9.3
	 */
	@Post('apple')
	@HttpCode(HttpStatus.OK)
	@Public()
	@ApiOperation({
		summary: 'Sign in with Apple',
		description: '**Access:** Public\n**Requirements:** FR-AUTH-02, FR-AUTH-03\n\nVerifies the Apple identity token and returns tokens with the user account. Send `fullName` only on the first sign-in; Apple provides it once. A new identity links to an existing account only when Apple confirms the email is verified.',
	})
	@ApiOkResponse({ type: AuthResponseDto })
	@ApiErrorResponses(ErrorCode.ValidationError, ErrorCode.Unauthenticated, ErrorCode.AccountDisabled, ErrorCode.RateLimited)
	signInWithApple(@Body() dto: AppleSignInDto): Promise<AuthResponseDto> {
		throw new NotImplementedException();
	}

	/**
	 * Sign in with Facebook.
	 * SRS FR-AUTH-02, FR-AUTH-03 · SDD §9.3
	 */
	@Post('facebook')
	@HttpCode(HttpStatus.OK)
	@Public()
	@ApiOperation({
		summary: 'Sign in with Facebook',
		description: '**Access:** Public\n**Requirements:** FR-AUTH-02, FR-AUTH-03\n\nValidates the Facebook access token and returns tokens with the user account. The provider email may be missing. A new identity links to an existing account only when Facebook confirms the email is verified.',
	})
	@ApiOkResponse({ type: AuthResponseDto })
	@ApiErrorResponses(ErrorCode.ValidationError, ErrorCode.Unauthenticated, ErrorCode.AccountDisabled, ErrorCode.RateLimited)
	signInWithFacebook(@Body() dto: FacebookSignInDto): Promise<AuthResponseDto> {
		throw new NotImplementedException();
	}

	/**
	 * Sign in with LinkedIn.
	 * SRS FR-AUTH-02, FR-AUTH-03 · SDD §9.3
	 */
	@Post('linkedin')
	@HttpCode(HttpStatus.OK)
	@Public()
	@ApiOperation({
		summary: 'Sign in with LinkedIn',
		description: '**Access:** Public\n**Requirements:** FR-AUTH-02, FR-AUTH-03\n\nExchanges the browser authorization code with LinkedIn and returns tokens with the user account. A new identity links to an existing account only when LinkedIn confirms the email is verified.',
	})
	@ApiOkResponse({ type: AuthResponseDto })
	@ApiErrorResponses(ErrorCode.ValidationError, ErrorCode.Unauthenticated, ErrorCode.AccountDisabled, ErrorCode.RateLimited)
	signInWithLinkedIn(@Body() dto: LinkedInSignInDto): Promise<AuthResponseDto> {
		throw new NotImplementedException();
	}
}

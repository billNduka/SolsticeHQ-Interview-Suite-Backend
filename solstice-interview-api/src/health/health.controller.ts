import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '../common/decorators/public.decorator.js';
import { HealthResponseDto } from './health-response.dto.js';

@ApiTags('System')
@Controller('health')
export class HealthController {
	/**
	 * Return the service liveness status.
	 * SDD §9.1
	 */
	@Get()
	@Public()
	@ApiOperation({
		summary: 'Check service health',
		description: '**Access:** Public\n\nReturns the current liveness status and response timestamp.',
	})
	@ApiOkResponse({ type: HealthResponseDto })
	getHealth(): HealthResponseDto {
		return { status: 'ok', timestamp: new Date().toISOString() };
	}
}

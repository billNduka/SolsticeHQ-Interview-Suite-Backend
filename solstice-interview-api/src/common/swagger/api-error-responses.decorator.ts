import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
} from '@nestjs/swagger';

import { ErrorCode, ERROR_HTTP_STATUS } from '../errors/error-codes.js';
import { ErrorResponseDto } from '../errors/error-response.dto.js';

export function ApiErrorResponses(...codes: ErrorCode[]) {
  const byStatus = new Map<number, ErrorCode[]>();
  for (const code of codes) {
    const status = ERROR_HTTP_STATUS[code];
    byStatus.set(status, [...(byStatus.get(status) ?? []), code]);
  }
  return applyDecorators(
    ApiExtraModels(ErrorResponseDto),
    ...[...byStatus].map(([status, list]) =>
      ApiResponse({
        status,
        description: `Error code(s): ${list.map((code) => `\`${code}\``).join(', ')}`,
        type: ErrorResponseDto,
      }),
    ),
  );
}

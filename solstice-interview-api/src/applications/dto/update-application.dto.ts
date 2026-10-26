import { PartialType } from '@nestjs/swagger';

import { CreateApplicationDto } from './create-application.dto.js';

/**
 * Partial application update request defined by SDD section 9.8.
 */
export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {}

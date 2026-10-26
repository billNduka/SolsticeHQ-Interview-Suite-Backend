import { Module } from '@nestjs/common';
import { JobDescriptionsController } from './job-descriptions.controller.js';
import { JobDescriptionsService } from './job-descriptions.service.js';

@Module({
  controllers: [JobDescriptionsController],
  providers: [JobDescriptionsService]
})
export class JobDescriptionsModule {}

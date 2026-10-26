import { Module } from '@nestjs/common';
import { AdminQuestionsController } from './admin-questions.controller.js';
import { QuestionsService } from './questions.service.js';

@Module({
  controllers: [AdminQuestionsController],
  providers: [QuestionsService]
})
export class QuestionsModule {}

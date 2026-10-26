import { Module } from '@nestjs/common';
import { AiModule } from './ai/ai.module.js';
import { StorageModule } from './storage/storage.module.js';
import { MailModule } from './mail/mail.module.js';
import { QueueModule } from './queue/queue.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ProfileModule } from './profile/profile.module.js';
import { ResumesModule } from './resumes/resumes.module.js';
import { JobDescriptionsModule } from './job-descriptions/job-descriptions.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { QuestionsModule } from './questions/questions.module.js';
import { SkillsAuditModule } from './skills-audit/skills-audit.module.js';
import { MatchingModule } from './matching/matching.module.js';
import { InterviewsModule } from './interviews/interviews.module.js';
import { CompaniesModule } from './companies/companies.module.js';
import { ApplicationsModule } from './applications/applications.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { AdminModule } from './admin/admin.module.js';
import { HealthModule } from './health/health.module.js';

@Module({
  imports: [AiModule, StorageModule, MailModule, QueueModule, UsersModule, AuthModule, ProfileModule, ResumesModule, JobDescriptionsModule, CategoriesModule, QuestionsModule, SkillsAuditModule, MatchingModule, InterviewsModule, CompaniesModule, ApplicationsModule, DashboardModule, AdminModule, HealthModule],
})
export class AppModule {}

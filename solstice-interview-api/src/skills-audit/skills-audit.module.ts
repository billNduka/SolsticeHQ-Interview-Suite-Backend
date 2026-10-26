import { Module } from '@nestjs/common';
import { SkillsAuditController } from './skills-audit.controller.js';
import { AdminSkillsAuditTemplatesController } from './admin-skills-audit-templates.controller.js';
import { SkillsAuditService } from './skills-audit.service.js';

@Module({
  controllers: [SkillsAuditController, AdminSkillsAuditTemplatesController],
  providers: [SkillsAuditService]
})
export class SkillsAuditModule {}

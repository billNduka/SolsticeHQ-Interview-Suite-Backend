# Agent Instructions: Generate the API Stub Layer

**Project:** Solstice Interview Suite backend (NestJS)
**Specs:** `docs/solstice-interview-suite-sdd.md` (v0.2) and `docs/solstice-interview-suite-srs.md` (v0.2)
**Owner:** Bill (backend). **Consumer of the output:** Joel (Flutter), who generates a Dart client from the OpenAPI spec.

---

## 0. How to use this file

1. Copy the SDD and SRS (v0.2) into `docs/` in the repo, and this file into `docs/AGENT-STUB-INSTRUCTIONS.md`.
2. Work in the phases in section 11, one phase per agent session. **Stop at the end of each phase** and wait for review.
3. Where this file and the SDD disagree, the **SDD wins**. Tell the owner about the disagreement in the phase summary.

---

## 1. Goal

Make every endpoint in SDD section 9 (**exactly 70 operations**) appear in Swagger UI at `/api/docs`, fully documented: route, auth requirement, request body/query/params, success response schema, and error responses. No business logic exists yet.

This is a **contract-first stub phase**. The output is the API contract, so Joel can start building against it.

## 2. Non-goals (do NOT do any of these)

- Do not implement business logic, database access, or real authentication.
- Do not install or configure Prisma, Redis, BullMQ, Zod, argon2, Passport, JWT libraries, throttler, S3 SDKs, mail or AI SDKs.
- Do not touch the `ai`, `storage`, `mail` and `queue` modules beyond leaving them as generated.
- Do not put anything in service classes. **Services stay untouched**; only controllers, DTOs, enums and shared helpers change.
- Do not rename, move or merge existing modules and folders.
- Do not register any guard globally (no `APP_GUARD`). See section 5.
- Do not invent endpoints, fields or error codes that are not in the SDD. If something is missing, follow section 10.

## 3. Sources of truth (read these first, in this order)

| What you need | Where |
|---|---|
| Endpoints, bodies, access levels, notes | SDD section 9 |
| API conventions (base path, pagination, error shape) | SDD section 8 |
| Error codes and their HTTP statuses | SDD section 8.2 |
| Field names, enums, nullability for response DTOs | SDD section 4.2 (tables) and section 4.3 |
| Auth rules, admin safeguards, linking rule | SDD sections 5.1 to 5.4 |
| Which AI features have usage limits | SDD section 6.3 |
| Flow behaviour (interviews, uploads, insights) | SDD section 7 |
| Requirement IDs to cite in docs (FR-xxx) | SRS section 4 |

---

## 4. Phase 0: environment checks (do these before writing anything)

1. Read `package.json`. Note whether `"type": "module"` is set.
   - **If ESM:** every relative import must end in `.js` (`import { X } from './x.dto.js'`). Match this everywhere, including files you create by hand.
   - **If CommonJS:** no extensions.
2. Read `src/main.ts` and confirm: global prefix `api`, URI versioning with default version `1`, a global `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`, and Swagger mounted at `api/docs` with `addBearerAuth()`. Fix anything missing.
3. In `main.ts`, change the Swagger document creation to give clean, unique operation IDs (Joel's Dart client uses them as method names):
   ```ts
   const document = SwaggerModule.createDocument(app, config, {
     operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
   });
   ```
   This requires **every controller method name in the project to be globally unique** (see section 7).
4. In `main.ts`, register one `.addTag(name, description)` per tag in section 6.1 (in that order) so Swagger groups appear in a sensible order.
5. Delete the default `AppController`, `AppService` and `app.controller.spec.ts`, and remove them from `AppModule`. `GET /api/v1` must no longer exist. (`/health` replaces it.)
6. Check that these modules exist under `src/` (each with a `*.module.ts`): `auth`, `users`, `profile`, `categories`, `resumes`, `job-descriptions`, `questions`, `skills-audit`, `matching`, `interviews`, `companies`, `applications`, `dashboard`, `admin`, `ai`, `storage`, `mail`, `queue`, `health`. Also check these controllers exist: `auth/oauth.controller.ts`, `categories/admin-categories.controller.ts`, `questions/admin-questions.controller.ts`, `skills-audit/admin-skills-audit-templates.controller.ts`. Create anything missing with `nest g ... --no-spec` (add `--flat` for the sub-controllers above). Do not create duplicates.
7. Run `npm run build` and confirm it passes before you change anything. Report the result.

### Allowed new dependencies

Only: `class-validator`, `class-transformer`, `@nestjs/swagger` (if not installed), and `@types/multer` as a dev dependency (for the file upload types). Nothing else.

---

## 5. Phase A: shared building blocks (create these first)

### 5.1 Enums: `src/common/enums/`

One file per enum, string enums, values exactly as in the SDD:

| Enum | Values |
|---|---|
| `Role` | `user`, `admin` |
| `AuthProvider` | `google`, `apple`, `linkedin`, `facebook` |
| `CategoryKind` | `role`, `industry` |
| `ExperienceLevel` | `entry`, `mid`, `senior` |
| `QuestionType` | `behavioral`, `technical`, `situational` |
| `QuestionDifficulty` | `easy`, `medium`, `hard` |
| `QuestionStatus` | `draft`, `published`, `archived` |
| `TemplateStatus` | `draft`, `published` |
| `ApplicationStatus` | `saved`, `applied`, `interviewing`, `offer`, `rejected` |
| `InterviewStatus` | `in_progress`, `scoring`, `completed`, `abandoned`, `failed` |
| `InsightsStatus` | `pending`, `ready`, `failed` |

Whenever an enum is used in a DTO, write `@ApiProperty({ enum: TheEnum, enumName: 'TheEnum', ... })`. The `enumName` makes Swagger emit one reusable schema, which gives Joel a proper Dart enum.

### 5.2 Errors: `src/common/errors/`

- `error-codes.ts`: `export enum ErrorCode { ... }` with **all 14 codes from SDD 8.2**, plus `export const ERROR_HTTP_STATUS: Record<ErrorCode, number>` mapping each to its HTTP status exactly as in that table.
- `error-response.dto.ts`: `ErrorResponseDto` with `code` (enum `ErrorCode`), `message` (string), `details` (optional object). Matches `{ "code", "message", "details" }`.

### 5.3 Swagger helpers: `src/common/swagger/`

**`api-error-responses.decorator.ts`**: takes error codes, groups them by HTTP status and documents each status once, listing the codes in the description:

```ts
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
        description: `Error code(s): ${list.map((c) => `\`${c}\``).join(', ')}`,
        type: ErrorResponseDto,
      }),
    ),
  );
}
```

**`api-paginated-response.decorator.ts`**: documents the `{ data: T[], meta: { page, limit, total } }` envelope for any DTO:

```ts
export const ApiPaginatedResponse = <T extends Type<unknown>>(model: T) =>
  applyDecorators(
    ApiExtraModels(PaginationMetaDto, model),
    ApiOkResponse({
      schema: {
        type: 'object',
        required: ['data', 'meta'],
        properties: {
          data: { type: 'array', items: { $ref: getSchemaPath(model) } },
          meta: { $ref: getSchemaPath(PaginationMetaDto) },
        },
      },
    }),
  );
```

### 5.4 Pagination: `src/common/dto/`

- `pagination-query.dto.ts`: `PaginationQueryDto` with `page` (int, min 1, default 1) and `limit` (int, min 1, **max 100 (proposed)**, default 20). Use `@Type(() => Number)`, `@IsInt()`, `@Min()`, `@Max()`, `@IsOptional()`, and `@ApiPropertyOptional` with `default`, `minimum`, `maximum`.
- `pagination-meta.dto.ts`: `PaginationMetaDto` with `page`, `limit`, `total`.
- Any list query DTO with extra filters **extends** `PaginationQueryDto`.
- `message-response.dto.ts`: `MessageResponseDto { message: string }`, used where the SDD says an endpoint "sends an email" or similar and defines no body.

### 5.5 Decorators and guards: `src/common/decorators/`, `src/common/guards/`

Keep these **minimal and non-enforcing** for now:

- `@Public()`: `SetMetadata('isPublic', true)`.
- `@Roles(...roles: Role[])`: `SetMetadata('roles', roles)`.
- `@CurrentUser()`: param decorator returning `request.user` typed as `AuthenticatedUser { id: string; role: Role }` (put the interface in `src/common/types/authenticated-user.ts`).
- `JwtAuthGuard` and `RolesGuard`: `canActivate()` returns `true`, with a comment `// TODO(week-1): real implementation. SDD 5.4`.

**Do not register any guard globally.** Right now there is no real auth, so a global guard would only break Swagger's "Try it out". It gets switched on when auth is implemented.

You still **apply** the decorators everywhere they belong (section 6.2), because they document intent and keep the OpenAPI security metadata correct.

### 5.6 Shared DTOs used by several modules

`UserResponseDto` is used by both `users` and `auth`. Define it once in `src/users/dto/user-response.dto.ts` (fields in section 8.4) and import it from `auth`. Do not duplicate it.

---

## 6. Conventions for every controller

### 6.1 Tags (use these exact names)

| Controller | `@ApiTags(...)` |
|---|---|
| health | `System` |
| auth | `Auth` |
| oauth | `Auth: Social sign-in` |
| users | `Users` |
| profile | `Career profile` |
| categories | `Categories` |
| resumes | `Resumes` |
| job-descriptions | `Job descriptions` |
| applications | `Application tracker` |
| skills-audit | `Skills audit` |
| matching | `Resume/JD matching` |
| interviews | `Mock interviews` |
| companies | `Company lookup` |
| dashboard | `Dashboard` |
| admin-questions | `Admin: Question bank` |
| admin-categories | `Admin: Categories` |
| admin-skills-audit-templates | `Admin: Skills audit templates` |
| admin | `Admin: Users and stats` |

### 6.2 Auth and access decorators

| Access (SDD 9) | Apply |
|---|---|
| Public | `@Public()` on each public route. No `@ApiBearerAuth()`. |
| User | `@ApiBearerAuth()` and `@UseGuards(JwtAuthGuard)` at class level. |
| Admin | Class level: `@ApiBearerAuth()`, `@UseGuards(JwtAuthGuard, RolesGuard)`, `@Roles(Role.Admin)`. |

On every user-scoped handler, take `@CurrentUser() user: AuthenticatedUser` as a parameter. The user's ID always comes from the token, **never from the body or query** (SDD 4.3).

### 6.3 Handler shape

- Every handler body is exactly: `throw new NotImplementedException();`
- Do **not** use the `async` keyword. Declare the return type as `Promise<TheDto>` (or `Promise<void>` for 204, or `Promise<StreamableFile>` for file downloads).
- Path params that are IDs: `@Param('id', ParseUUIDPipe) id: string`, with `@ApiParam({ name: 'id', description: '...', format: 'uuid' })`.
- Handler names must be **globally unique** across the project because they become operation IDs. Use `verbNoun`: `registerUser`, `loginWithPassword`, `listResumes`, `getResume`, `downloadResumeFile`, `updateResume`, `deleteResume`, `adminListQuestions`, `adminCreateQuestion`, and so on. Prefix admin handlers with `admin`.
- Put a file-level `/* eslint-disable @typescript-eslint/no-unused-vars */` at the top of each controller file with a comment `// Stub phase: remove when implemented`. Do not disable lint rules anywhere else.
- If two routes could clash (a literal segment and `:id` on the same method), declare the literal route **first**. The known case is `GET skills-audit/template` before `GET skills-audit/:id`.

### 6.4 Success status codes (proposed defaults, since the SDD is silent)

| Case | Status | How |
|---|---|---|
| POST that creates one record | 201 | Nest default. Use `@ApiCreatedResponse`. |
| POST that performs an action or batch (`auth/login`, `refresh`, `verify-email`, `oauth/*`, `interviews/:id/answers`, `complete`, `abandon`, `admin/questions/import`) | 200 | `@HttpCode(HttpStatus.OK)` and `@ApiOkResponse`. |
| GET, PATCH, PUT | 200 | `@ApiOkResponse` |
| DELETE, `auth/logout`, `users/me/password` | 204 | `@HttpCode(HttpStatus.NO_CONTENT)` and `@ApiNoContentResponse` |

### 6.5 Documentation required on every handler

1. A JSDoc block: one-line purpose, then `FR-...` IDs and `SDD §9.x`.
2. `@ApiOperation({ summary, description })`:
   - `summary`: short, imperative, no full stop ("Add an application").
   - `description`: Markdown with these labelled lines, in this order, skipping any that do not apply:
     - `**Access:** Public | User | Admin`
     - `**Requirements:** FR-TRK-01, FR-TRK-02`
     - What it does, in one or two sentences, including side effects (emails sent, tokens revoked, files deleted, rows kept).
     - `**Rules:**` the SDD's notes for this endpoint, as short sentences (for example "Setting a new default clears the old one").
     - `**Async:**` for polling endpoints, say which status values the client polls for.
     - `**Limits:**` for AI-backed endpoints, the daily limit from SDD 6.3.
3. Exactly one success response decorator with `type` set (or a `schema` for binary).
4. `@ApiErrorResponses(...)` listing the codes from section 6.6.
5. `@ApiQuery` / `@ApiParam` where Nest cannot infer enough (path params, enum query params), each with a `description`.

### 6.6 Which error codes to list

Build the list from these rules, then add the endpoint-specific extras from section 8:

| Rule | Add |
|---|---|
| Not `@Public()` | `UNAUTHENTICATED` |
| Admin route | `FORBIDDEN` |
| Handler takes any body, query or path param | `VALIDATION_ERROR` |
| Route has `:id` or another resource param | `NOT_FOUND` |
| Any route under `auth/` | `RATE_LIMITED` |

`USAGE_LIMIT_REACHED` and `AI_UNAVAILABLE` are never added by a rule. They appear only where section 8 lists them for a specific endpoint. Never list a code the SDD does not define.

---

## 7. DTO conventions

- **Location:** `src/<module>/dto/<kebab-name>.dto.ts`, **one class per file**. Files must end in `.dto.ts` so the Swagger CLI plugin picks them up.
- **Names:** requests `CreateXDto`, `UpdateXDto`, `ListXQueryDto`, or `VerbNounDto`. Responses `XResponseDto`. Never reuse a request DTO as a response.
- **Request DTOs:** `class-validator` decorators on every field, plus `@ApiProperty` / `@ApiPropertyOptional`.
- **Response DTOs:** only `@ApiProperty` / `@ApiPropertyOptional`. No validators.
- **Every `@ApiProperty` must have:** `description` and `example`. Add `format: 'uuid'` for IDs, `format: 'date-time'` for timestamps (ISO 8601, UTC), `enum` + `enumName` for enums, `nullable: true` where the SDD says the column is nullable, `minimum`/`maximum`/`minLength`/`maxLength` where a rule is known.
- **Do not rely on the Swagger CLI plugin for descriptions.** Write them explicitly.
- **Update DTOs:** use `PartialType` imported from `@nestjs/swagger` (not `@nestjs/mapped-types`), so the metadata carries over.
- **Class-level JSDoc** on each DTO: what it represents, and the SDD table or section it comes from.
- **Pass-through IDs:** all IDs are UUIDs, so use `@IsUUID()`.
- **Dates in requests:** `@IsISO8601()` (for example `appliedAt`).
- **Passwords:** `@IsString()`, `@MinLength(8)`, `@MaxLength(128)` (proposed, mark `TODO(spec)`). Never include password hashes or tokens in any response except the token fields in auth responses.
- **JSONB-shaped fields** (audit items and results, match results, insights, report questions): create nested DTO classes, not `object` or `any`. Use the field names the SDD gives; for any name or shape it does not give, make the smallest reasonable shape and mark `TODO(spec)` (section 10).

---

## 8. Endpoint work list

Legend: **Extra error codes** are added to the baseline from section 6.6. "Paginated" means the request extends `PaginationQueryDto` and the response uses `@ApiPaginatedResponse`.

### 8.1 `health`: `@Controller('health')`

| Handler | Route | Notes |
|---|---|---|
| `getHealth` | GET `/` | `@Public()`. **The only endpoint with a real body for now:** return `{ status: 'ok', timestamp }` (`HealthResponseDto`). |

### 8.2 `auth`: `@Controller('auth')`, all routes `@Public()`

| Handler | Route | Request DTO | Response (status) | Extra errors |
|---|---|---|---|---|
| `registerUser` | POST `register` | `RegisterDto { email, password, fullName }` | `MessageResponseDto` (201) | `CONFLICT` |
| `verifyEmail` | POST `verify-email` | `VerifyEmailDto { token }` | `MessageResponseDto` (200) | `INVALID_TOKEN` |
| `resendVerificationEmail` | POST `resend-verification` | `ResendVerificationDto { email }` | `MessageResponseDto` (200) | none. Always 200, so it never reveals which emails exist. |
| `loginWithPassword` | POST `login` | `LoginDto { email, password }` | `AuthResponseDto` (200) | `INVALID_CREDENTIALS`, `EMAIL_NOT_VERIFIED`, `ACCOUNT_DISABLED` |
| `refreshTokens` | POST `refresh` | `RefreshTokenDto { refreshToken }` | `TokenPairResponseDto { accessToken, refreshToken }` (200) | `UNAUTHENTICATED`, `ACCOUNT_DISABLED`. Description: rotates the refresh token; reuse of an old one revokes the whole family (SDD 5.1). |
| `logoutUser` | POST `logout` | `RefreshTokenDto` | none (204) | none. Description: public on purpose so logout works after the access token expires. |
| `forgotPassword` | POST `forgot-password` | `ForgotPasswordDto { email }` | `MessageResponseDto` (200) | none. Always 200. |
| `resetPassword` | POST `reset-password` | `ResetPasswordDto { token, newPassword }` | `MessageResponseDto` (200) | `INVALID_TOKEN`. Description: revokes all the user's refresh tokens. |

`AuthResponseDto { accessToken, refreshToken, user: UserResponseDto }` lives in `src/auth/dto/`.

### 8.3 `oauth`: `@Controller('auth/oauth')`, all routes `@Public()`

All four return `AuthResponseDto` (200) and add `UNAUTHENTICATED` (invalid provider token), `ACCOUNT_DISABLED`. Descriptions must summarise the verification step from SDD 5.3 and the **linking rule** (a new identity links to an existing account only when the provider confirms the email is verified).

| Handler | Route | Request DTO | Note for description |
|---|---|---|---|
| `signInWithGoogle` | POST `google` | `GoogleSignInDto { idToken }` | Audience must match one of our iOS, Android or web client IDs. |
| `signInWithApple` | POST `apple` | `AppleSignInDto { identityToken, fullName? }` | Send `fullName` on the first sign-in only; Apple provides it once. Email may be a private relay address. |
| `signInWithFacebook` | POST `facebook` | `FacebookSignInDto { accessToken }` | Email may be missing. |
| `signInWithLinkedIn` | POST `linkedin` | `LinkedInSignInDto { code, redirectUri }` | Browser-based authorization-code flow. |

### 8.4 `users`: `@Controller('users/me')`, user access

| Handler | Route | Request | Response (status) | Extra errors |
|---|---|---|---|---|
| `getCurrentUser` | GET `/` | none | `UserResponseDto` (200) | none |
| `updateCurrentUser` | PATCH `/` | `UpdateMeDto { fullName?, avatarUrl? }` | `UserResponseDto` (200) | none |
| `changePassword` | PATCH `password` | `ChangePasswordDto { currentPassword?, newPassword }` | none (204) | `TODO(spec)`: no code is defined for a wrong `currentPassword`. Document `VALIDATION_ERROR` and mark it. Description: `currentPassword` is required only if the account already has a password. |
| `deleteCurrentUser` | DELETE `/` | none | none (204) | none. Description: deletes the account and all data, including resume files in storage; required by Apple's App Store rules. |
| `listIdentities` | GET `identities` | none | `IdentityResponseDto[]` (200), **not paginated** (`TODO(spec)`) | none |
| `unlinkIdentity` | DELETE `identities/:provider` | param `provider` (enum `AuthProvider`) | none (204) | `INVALID_STATE` (would leave no identity and no password), `NOT_FOUND` |

`UserResponseDto { id, email (nullable), emailVerified, fullName, avatarUrl (nullable), role, hasPassword, createdAt }`.
`IdentityResponseDto { provider, email (nullable), linkedAt }`.

### 8.5 `profile`: `@Controller('users/me/profile')`, user access

| Handler | Route | Request | Response (status) | Extra errors |
|---|---|---|---|---|
| `getCareerProfile` | GET `/` | none | `CareerProfileResponseDto` (200) | `NOT_FOUND` (no profile yet) |
| `upsertCareerProfile` | PUT `/` | `UpsertCareerProfileDto { targetRoleCategoryId, industryCategoryId?, experienceLevel, location? }` | `CareerProfileResponseDto` (200) | none |

Response includes the category IDs plus the role and industry category names, so the app can display them without extra calls (`TODO(spec)` if you add the names).

### 8.6 `categories`: `@Controller('categories')`, user access

| Handler | Route | Request | Response (status) |
|---|---|---|---|
| `listCategories` | GET `/` | `ListCategoriesQueryDto { kind? }` | `CategoryResponseDto[]` (200), **not paginated** (SDD 9.5) |

`CategoryResponseDto { id, name, kind }`. Only active categories are returned (say so in the description).

### 8.7 `resumes`: `@Controller('resumes')`, user access

| Handler | Route | Request | Response (status) | Extra errors |
|---|---|---|---|---|
| `uploadResume` | POST `/` | multipart: `UploadResumeDto { file, title? }` | `ResumeResponseDto` (201) | none beyond baseline. Description: PDF or DOCX, max 5 MB. |
| `listResumes` | GET `/` | `PaginationQueryDto` | paginated `ResumeResponseDto` | none |
| `getResume` | GET `:id` | none | `ResumeDetailResponseDto` (200), includes `extractedText` | none |
| `downloadResumeFile` | GET `:id/file` | none | `StreamableFile` (200), binary | none. Description: streams the original file after an ownership check. |
| `updateResume` | PATCH `:id` | `UpdateResumeDto { title?, isDefault? }` | `ResumeResponseDto` (200) | none. Rule: setting a new default clears the old one. |
| `deleteResume` | DELETE `:id` | none | none (204) | none. Rule: deletes the file; past matches are kept. |

For the upload, add `@ApiConsumes('multipart/form-data')`, `@UseInterceptors(FileInterceptor('file'))`, and an `@ApiBody` schema showing `file` as `{ type: 'string', format: 'binary' }`. The handler takes `@UploadedFile() file: Express.Multer.File`. Do not add validation pipes yet. For the download, add `@ApiProduces` for PDF and DOCX, and a response schema of `{ type: 'string', format: 'binary' }`.

`ResumeResponseDto { id, title, mimeType, sizeBytes, isDefault, createdAt }`. `ResumeDetailResponseDto` adds `extractedText`.

### 8.8 `job-descriptions`: `@Controller('job-descriptions')`, user access

| Handler | Route | Request | Response (status) |
|---|---|---|---|
| `createJobDescription` | POST `/` | `CreateJobDescriptionDto { title, companyName?, text }` | `JobDescriptionResponseDto` (201) |
| `listJobDescriptions` | GET `/` | `PaginationQueryDto` | paginated `JobDescriptionResponseDto` |
| `getJobDescription` | GET `:id` | none | `JobDescriptionResponseDto` (200) |
| `deleteJobDescription` | DELETE `:id` | none | none (204). Rule: linked matches, interviews and applications are kept. |

### 8.9 `applications`: `@Controller('applications')`, user access

| Handler | Route | Request | Response (status) |
|---|---|---|---|
| `createApplication` | POST `/` | `CreateApplicationDto { companyName, roleTitle, status?, appliedAt?, jobDescriptionId?, companyId?, notes? }` | `ApplicationResponseDto` (201). `status` defaults to `saved`. |
| `listApplications` | GET `/` | `ListApplicationsQueryDto { status? }` extends `PaginationQueryDto` | paginated `ApplicationResponseDto` |
| `getApplication` | GET `:id` | none | `ApplicationResponseDto` (200) |
| `updateApplication` | PATCH `:id` | `UpdateApplicationDto` = `PartialType(CreateApplicationDto)` | `ApplicationResponseDto` (200). Description: also used to change status, for example `{ "status": "interviewing" }`. |
| `deleteApplication` | DELETE `:id` | none | none (204) |

### 8.10 `skills-audit`: `@Controller('skills-audit')`, user access

| Handler | Route | Request | Response (status) | Extra errors |
|---|---|---|---|---|
| `getSkillsAuditTemplate` | GET `template` | `SkillsAuditTemplateQueryDto { roleCategoryId? }` | `SkillsAuditTemplateResponseDto` (200) | `NOT_FOUND` (no published template for the role). Defaults to the user's profile role. **Declare before `:id`.** |
| `submitSkillsAudit` | POST `/` | `SubmitSkillsAuditDto { templateId, responses }` | `SkillsAuditResultResponseDto` (201) | `NOT_FOUND`, `USAGE_LIMIT_REACHED`, `AI_UNAVAILABLE`. Limit: 5 per user per day (SDD 6.3). Synchronous AI call. |
| `listSkillsAudits` | GET `/` | `PaginationQueryDto` | paginated `SkillsAuditSummaryResponseDto` | none |
| `getSkillsAudit` | GET `:id` | none | `SkillsAuditResultResponseDto` (200) | none |

Result shape: strengths, gaps, recommendations (SDD 4.2). Define nested DTOs; mark any field detail the SDD does not give with `TODO(spec)`. `responses` is an array of nested `SkillsAuditResponseItemDto` (`TODO(spec)` for its fields).

### 8.11 `matching`: `@Controller('matches')`, user access

| Handler | Route | Request | Response (status) | Extra errors |
|---|---|---|---|---|
| `runMatch` | POST `/` | `RunMatchDto { resumeId, jobDescriptionId }` | `MatchResponseDto` (201) | `NOT_FOUND` (resume or JD not the user's), `USAGE_LIMIT_REACHED`, `AI_UNAVAILABLE`. Limit: 10 per user per day. Synchronous AI call. |
| `listMatches` | GET `/` | `PaginationQueryDto` | paginated `MatchSummaryResponseDto` | none |
| `getMatch` | GET `:id` | none | `MatchResponseDto` (200) | none |

`MatchResponseDto { id, score (0 to 100), matchedSkills[], gaps[], suggestions[], resumeTitle, jobTitle, createdAt }`. Titles are copies stored on the match, so history still reads well if the resume or JD is deleted (SDD 4.2).

### 8.12 `interviews`: `@Controller('interviews')`, user access

| Handler | Route | Request | Response (status) | Extra errors |
|---|---|---|---|---|
| `startInterview` | POST `/` | `StartInterviewDto { type, difficulty, roleCategoryId?, jobDescriptionId?, companyId?, questionCount? }` | `InterviewSessionResponseDto` (201) | `NOT_ENOUGH_QUESTIONS`, `USAGE_LIMIT_REACHED`, `NOT_FOUND` (linked JD or company). Limit: 5 per user per day, checked here at start. `roleCategoryId` defaults to the profile role. `questionCount` defaults to 5 (proposed). |
| `listInterviews` | GET `/` | `ListInterviewsQueryDto { status? }` extends `PaginationQueryDto` | paginated `InterviewSummaryResponseDto` | none |
| `getInterview` | GET `:id` | none | `InterviewSessionResponseDto` (200) | none. Description: status, progress and current question; used to resume an unfinished session. |
| `submitInterviewAnswer` | POST `:id/answers` | `SubmitAnswerDto { questionId, answerText }` | `SubmitAnswerResponseDto { done, nextQuestion? }` (200) | `INVALID_STATE` |
| `completeInterview` | POST `:id/complete` | none | `InterviewStatusResponseDto { status }` (200), returns `scoring` | `INVALID_STATE`. Description: allowed from `in_progress` (with at least one answer) or `failed` (retry). Scoring runs in the background. |
| `abandonInterview` | POST `:id/abandon` | none | `InterviewStatusResponseDto` (200) | `INVALID_STATE`. Only from `in_progress`. No scoring. |
| `getInterviewReport` | GET `:id/report` | none | `InterviewReportResponseDto` (200) | none. **Async:** returns the current status until it is `completed`; the app polls this. |

`InterviewSessionResponseDto { id, type, difficulty, status, progress { current, total }, currentQuestion? { id, position, text } }`.
`InterviewReportResponseDto { id, status, overallScore?, summaryFeedback?, questions? [{ position, questionText, answerText, score, feedback }] }`. The optional fields are present only when `status` is `completed`; say so in each `description`.
Include the status flow in the controller description: `in_progress` → `scoring` → `completed`, with `abandoned` and `failed` as side exits.

### 8.13 `companies`: `@Controller('companies')`, user access

| Handler | Route | Request | Response (status) | Extra errors |
|---|---|---|---|---|
| `searchCompanies` | GET `/` | `SearchCompaniesQueryDto { search? }` extends `PaginationQueryDto` | paginated `CompanyResponseDto` | none |
| `getCompany` | GET `:id` | none | `CompanyResponseDto { id, name, website?, overview? }` (200) | none |
| `getCompanyInterviewInsights` | GET `:id/interview-insights` | none | `InterviewInsightsResponseDto` (200) | none. **Async:** `{ status: "pending" }` while generating, then `{ status: "ready", insights }`. The `failed` status exists in the data model, so include it in the enum and mark `TODO(spec)`. |

`insights` is a nested DTO with the process, tips and common questions (SDD 7.3). Fields not named in the SDD get `TODO(spec)`.

### 8.14 `dashboard`: `@Controller('dashboard')`, user access

| Handler | Route | Response (status) |
|---|---|---|
| `getDashboard` | GET `/` | `DashboardResponseDto` (200) |

`DashboardResponseDto { recentInterviews: InterviewSummaryResponseDto[], averageScore (nullable), latestSkillsAudit (nullable), latestMatch (nullable), applicationCounts }`. `applicationCounts` is a nested DTO with one integer per `ApplicationStatus`. Reuse the existing summary DTOs; do not duplicate them. Mark "average scores" with `TODO(spec)` (the SRS says "scores" in the plural and does not define which averages).

### 8.15 `admin-questions`: `@Controller('admin/questions')`, admin access

| Handler | Route | Request | Response (status) | Extra errors |
|---|---|---|---|---|
| `adminListQuestions` | GET `/` | `ListQuestionsQueryDto { type?, difficulty?, status?, roleCategoryId?, industryCategoryId?, search? }` extends `PaginationQueryDto` | paginated `QuestionResponseDto` | none |
| `adminCreateQuestion` | POST `/` | `CreateQuestionDto { text, type, difficulty, categoryIds, rubric?, modelAnswer?, status? }` | `QuestionResponseDto` (201) | none. Starts as `draft` unless a status is given. |
| `adminGetQuestion` | GET `:id` | none | `QuestionResponseDto` (200) | none |
| `adminUpdateQuestion` | PATCH `:id` | `UpdateQuestionDto` = `PartialType(CreateQuestionDto)` | `QuestionResponseDto` (200) | none. Description: also used to publish, unpublish, archive and restore, via `status`. |
| `adminImportQuestions` | POST `import` | multipart: `ImportQuestionsDto { file }` | `ImportQuestionsResponseDto { created, errors: [{ row, message }] }` (200) | none. `TODO(spec)`: CSV format is not defined yet. |

Add this sentence to the controller description: **There is deliberately no DELETE.** Past interview sessions reference questions, so they are archived instead (SDD 9.14).

### 8.16 `admin-categories`: `@Controller('admin/categories')`, admin access

| Handler | Route | Request | Response (status) | Extra errors |
|---|---|---|---|---|
| `adminListCategories` | GET `/` | `AdminListCategoriesQueryDto { kind? }` extends `PaginationQueryDto` (`TODO(spec)`: SDD does not say whether this list is paginated) | paginated `AdminCategoryResponseDto` | none |
| `adminCreateCategory` | POST `/` | `CreateCategoryDto { name, kind, isActive? }` | `AdminCategoryResponseDto` (201) | `CONFLICT` (unique on kind + name) |
| `adminUpdateCategory` | PATCH `:id` | `UpdateCategoryDto { name?, isActive? }` | `AdminCategoryResponseDto` (200) | `CONFLICT` |

Rule for the description: deactivated categories disappear from user pickers but stay on existing records. `AdminCategoryResponseDto` adds `isActive` to the public shape.

### 8.17 `admin-skills-audit-templates`: `@Controller('admin/skills-audit/templates')`, admin access

| Handler | Route | Request | Response (status) |
|---|---|---|---|
| `adminListSkillsAuditTemplates` | GET `/` | `PaginationQueryDto` | paginated `AdminSkillsAuditTemplateResponseDto` |
| `adminCreateSkillsAuditTemplate` | POST `/` | `CreateSkillsAuditTemplateDto { title, roleCategoryId, items }` | `AdminSkillsAuditTemplateResponseDto` (201) |
| `adminGetSkillsAuditTemplate` | GET `:id` | none | `AdminSkillsAuditTemplateResponseDto` (200) |
| `adminUpdateSkillsAuditTemplate` | PATCH `:id` | `UpdateSkillsAuditTemplateDto { title?, roleCategoryId?, items?, status? }` | `AdminSkillsAuditTemplateResponseDto` (200) |

Rule for the PATCH description: publishing a template unpublishes any other published template for the same role. `items` is an array of nested DTOs (`TODO(spec)` for the item fields: the SDD only says it holds the skills or questions and the response format).

### 8.18 `admin`: `@Controller('admin')`, admin access

| Handler | Route | Request | Response (status) | Extra errors |
|---|---|---|---|---|
| `adminListUsers` | GET `users` | `AdminListUsersQueryDto { search? }` extends `PaginationQueryDto` | paginated `AdminUserResponseDto` | none. `search` matches name or email. |
| `adminUpdateUser` | PATCH `users/:id` | `AdminUpdateUserDto { role?, isDisabled? }` | `AdminUserResponseDto` (200) | `INVALID_STATE` for the safeguards, marked `TODO(spec)` because the SDD names the rules but no code. Rules (SDD 5.4): an admin cannot change their own role or disable themselves, and the last admin cannot be demoted or disabled. Disabling revokes all the user's refresh tokens. |
| `adminGetStats` | GET `stats` | none | `AdminStatsResponseDto { signups, activeUsers, interviewsCompleted, averageScore }` (200) | none. `TODO(spec)`: time window is not defined. |

`AdminUserResponseDto { id, email (nullable), fullName, role, isDisabled, emailVerified, createdAt }`.

---

## 9. Gold-standard example (match this level of detail)

```ts
// src/applications/dto/create-application.dto.ts
/**
 * Request body for adding a job application to the tracker.
 * SRS FR-TRK-01, FR-TRK-02, FR-TRK-04 · SDD §9.8
 */
export class CreateApplicationDto {
  @ApiProperty({ description: 'Name of the company applied to', example: 'Shopify', maxLength: 200 })
  @IsString() @IsNotEmpty() @MaxLength(200)
  companyName: string;

  @ApiProperty({ description: 'Title of the role', example: 'Junior Backend Developer', maxLength: 200 })
  @IsString() @IsNotEmpty() @MaxLength(200)
  roleTitle: string;

  @ApiPropertyOptional({
    description: 'Application status. Defaults to `saved`.',
    enum: ApplicationStatus, enumName: 'ApplicationStatus', example: ApplicationStatus.Applied,
  })
  @IsOptional() @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @ApiPropertyOptional({
    description: 'When the application was submitted (ISO 8601, UTC)',
    format: 'date-time', example: '2026-11-02T09:30:00.000Z',
  })
  @IsOptional() @IsISO8601()
  appliedAt?: string;

  @ApiPropertyOptional({ description: 'Saved job description this application relates to', format: 'uuid' })
  @IsOptional() @IsUUID()
  jobDescriptionId?: string;

  @ApiPropertyOptional({ description: 'Company record this application relates to', format: 'uuid' })
  @IsOptional() @IsUUID()
  companyId?: string;

  @ApiPropertyOptional({ description: 'Free-text notes', example: 'Referred by a former colleague' })
  @IsOptional() @IsString()
  notes?: string;
}
```

```ts
// src/applications/applications.controller.ts
// Stub phase: remove when implemented
/* eslint-disable @typescript-eslint/no-unused-vars */
@ApiTags('Application tracker')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  /**
   * Add a job application to the tracker.
   * SRS FR-TRK-01, FR-TRK-02, FR-TRK-04 · SDD §9.8
   */
  @Post()
  @ApiOperation({
    summary: 'Add an application',
    description: [
      '**Access:** User',
      '**Requirements:** FR-TRK-01, FR-TRK-02, FR-TRK-04',
      '',
      'Adds a job application for the signed-in user. Optionally links it to a saved job description or a company.',
      '',
      '**Rules:** `status` defaults to `saved`.',
    ].join('\n'),
  })
  @ApiCreatedResponse({ type: ApplicationResponseDto })
  @ApiErrorResponses(ErrorCode.UNAUTHENTICATED, ErrorCode.VALIDATION_ERROR)
  createApplication(
    @Body() dto: CreateApplicationDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ApplicationResponseDto> {
    throw new NotImplementedException();
  }
}
```

(If the project is ESM, add `.js` to every relative import in the real files.)

---

## 10. When the spec is silent: `TODO(spec)`

Never guess silently. When you have to make a choice the SDD or SRS does not cover:

1. Pick the most conventional default (the proposed defaults in this file count).
2. Leave a comment at that spot: `// TODO(spec): <what is undefined> | assumed: <what you chose>`.
3. Add the same note to the `description` of the relevant `@ApiProperty` or `@ApiOperation` **only if Joel would be affected** (shapes, status codes, error codes).

At the end of the final phase, create `docs/SPEC-GAPS.md`: a table of every `TODO(spec)` in the code with columns **File**, **What is undefined**, **Assumed default**. Generate it by searching the codebase; do not write it from memory.

Known gaps to expect (list them in the file even if you resolve them with the defaults above): status codes for DELETE and action POSTs, response bodies for register, verify-email, forgot-password and reset-password, password rules, error code for a wrong current password, error code for the admin safeguards, pagination of identities and admin categories, `limit` maximum, `questionCount` bounds, the `failed` insights status, shapes of audit items, audit results, match results and insights, the questions CSV format, dashboard average scores, and the stats time window.

---

## 11. Phases (stop and report after each)

| Phase | Work | Stop when |
|---|---|---|
| **0** | Section 4 checks, plus `main.ts` changes and removing `AppController` | Build passes; report anything missing |
| **A** | Section 5: enums, errors, swagger helpers, pagination, decorators, guards | Build passes; list of files created |
| **B1** | `health`, `auth`, `oauth`, `users`, `profile` (8.1 to 8.5) | `/api/docs` shows 21 operations |
| **B2** | `categories`, `resumes`, `job-descriptions`, `applications` (8.6 to 8.9) | 37 operations |
| **B3** | `skills-audit`, `matching`, `interviews`, `companies`, `dashboard` (8.10 to 8.14) | 55 operations |
| **B4** | All admin controllers (8.15 to 8.18), then `docs/SPEC-GAPS.md` | **70 operations** |

Operation counts are cumulative. Commit once per phase with the message `feat(api): stub <phase description>`.

---

## 12. Definition of done (check before reporting each phase)

- `npm run build` and `npm run lint` pass.
- `npm run start:dev` starts without errors, and `/api/docs` loads.
- The operation count matches the table above. To check: `jq '[.paths[] | keys[]] | length' openapi.json` (the file is rewritten on startup).
- Every operation has: a tag, a summary, a description with the `**Access:**` line, a success response with a schema, and the right error responses.
- Every `@ApiProperty` has `description` and `example`.
- Every operation ID is unique and reads as a sensible method name (`loginWithPassword`, not `AuthController_login`).
- Each handler body is only `throw new NotImplementedException();` (except `getHealth`).
- No new dependencies beyond section 4's list.
- Every `/admin/*` route has the admin decorators; every non-public route has `@ApiBearerAuth()`; every public route has `@Public()`.
- Calling any stub (except `/health`) in Swagger "Try it out" returns **501**.

---

## 13. Kickoff prompt (paste this into the agent chat for each phase)

> Read `docs/AGENT-STUB-INSTRUCTIONS.md` in full. Then read the SDD (`docs/solstice-interview-suite-sdd.md`) sections 3, 4.2, 5, 8 and 9, and the SRS section 4. Do **Phase <X>** only, following the instructions exactly. The SDD wins over the instructions file on any conflict. Do not implement logic, do not touch services, do not add dependencies beyond the allowed list. When done, run the checks in section 12 and give me: a list of files created or changed, the operation count, and every `TODO(spec)` you added. Then stop.

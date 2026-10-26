# Solstice Interview Suite — Software Requirements Specification (SRS)

**Version:** 0.2 (draft)
**Date:** October 26, 2026
**Prepared by:** Bill (backend) · **Shared with:** Joel (frontend)
**Client:** Solstice HQ (Juliet Ijere)
**Companion document:** System Design Document (SDD), which includes the API endpoint reference

---

## 1. Introduction

### 1.1 Purpose

This document describes what the Solstice Interview Suite must do in its first release (v1). It is the shared reference for what we are building. How it is built is covered in the SDD.

### 1.2 Product summary

The Solstice Interview Suite helps job seekers prepare for interviews. Users can:

- assess their skills,
- practise mock interviews and get AI feedback,
- check how well their resume fits a job description,
- research companies,
- track their job applications.

Admins manage the interview question bank and skills audit content.

The product ships as a Flutter app for iOS and Android, plus a web version. A single backend API serves both.

### 1.3 Target users

The primary audience is job seekers, especially in Canada, in line with Solstice HQ's existing audience.

---

## 2. Scope

### 2.1 In scope for v1

- Accounts: email/password plus Google, Apple, LinkedIn and Facebook sign-in
- Career profile
- Resume upload and saved job descriptions
- Skills audit
- Resume/JD matching
- Text-based mock interviews with AI scoring and feedback
- Company lookup
- Application tracker
- Dashboard
- Admin side: question bank, categories, skills audit templates, users, basic stats

### 2.2 Out of scope for v1

- Hiring Manager tool
- Voice or video mock interviews
- Paid plans, subscriptions or payments
- Instagram sign-in. Meta offers no login for personal Instagram accounts, so Facebook is used instead.

---

## 3. User Roles

| Role | Description |
|---|---|
| Guest | Not signed in. Can only register, sign in or reset a password. |
| User | Signed-in job seeker. Uses all user-facing features. |
| Admin | Signed-in Solstice staff member. Has everything a user has, plus the admin side. |

---

## 4. Functional Requirements

Priority: **Must** = required for v1 launch · **Should** = include if time allows in v1

### 4.1 Accounts and authentication

| ID | Requirement | Priority |
|---|---|---|
| FR-AUTH-01 | Users can register with email and password, and must verify their email before signing in with a password. | Must |
| FR-AUTH-01a | Users can request a new verification email. | Must |
| FR-AUTH-02 | Users can sign in with Google, Apple, LinkedIn or Facebook. | Must |
| FR-AUTH-03 | A user who signs in with different providers that share a verified email ends up on one account. | Must |
| FR-AUTH-04 | Users can reset a forgotten password by email. | Must |
| FR-AUTH-05 | Users stay signed in between app launches until they sign out or their session expires. | Must |
| FR-AUTH-06 | Users can sign out. | Must |
| FR-AUTH-07 | Users can delete their account and all their data from within the app. | Must |
| FR-AUTH-08 | Users can view and unlink connected sign-in providers, but cannot remove their last way of signing in. | Should |
| FR-AUTH-09 | Signed-in users can change their password, or set one if they signed up with a social provider. | Should |

### 4.2 Career profile

| ID | Requirement | Priority |
|---|---|---|
| FR-PROF-01 | Users can set a target role and industry (chosen from admin-managed lists), an experience level and a location. | Must |
| FR-PROF-02 | AI features use the career profile to tailor their output. | Must |

### 4.3 Resumes and job descriptions

| ID | Requirement | Priority |
|---|---|---|
| FR-DOC-01 | Users can upload resumes as PDF or DOCX. | Must |
| FR-DOC-02 | Users can keep several resumes, rename them and mark one as the default. | Should |
| FR-DOC-03 | Users can save job descriptions by pasting the text. | Must |
| FR-DOC-04 | Users can delete resumes and job descriptions. Past results that used them are kept. | Must |
| FR-DOC-05 | Users can download resumes they uploaded. | Should |

### 4.4 Skills audit

| ID | Requirement | Priority |
|---|---|---|
| FR-SKL-01 | Users can take a skills audit for their target role. | Must |
| FR-SKL-02 | After submitting, users see their strengths, gaps and recommendations. | Must |
| FR-SKL-03 | Users can view past audit results. | Must |

### 4.5 Resume/JD matching

| ID | Requirement | Priority |
|---|---|---|
| FR-MAT-01 | Users can compare a saved resume against a saved job description. | Must |
| FR-MAT-02 | Results show a match score, matched skills, gaps and improvement suggestions. | Must |
| FR-MAT-03 | Users can view past match results. | Must |

### 4.6 Mock interviews

| ID | Requirement | Priority |
|---|---|---|
| FR-INT-01 | Users can start a mock interview by choosing a type (behavioral, technical, situational) and difficulty, optionally linked to a job description or company. | Must |
| FR-INT-02 | Questions come from the admin-managed question bank, and only published questions are used. | Must |
| FR-INT-03 | Users answer one question at a time in text. | Must |
| FR-INT-04 | When the interview ends, users get an overall score plus per-question scores and feedback. | Must |
| FR-INT-05 | Users can view past interviews and their reports. | Must |
| FR-INT-06 | Users can leave an interview unfinished and resume it later. | Should |
| FR-INT-07 | Users can end an interview early (only answered questions are scored) or abandon it without scoring. | Should |
| FR-INT-08 | If scoring fails, users can retry it without redoing the interview. | Must |

### 4.7 Company lookup

| ID | Requirement | Priority |
|---|---|---|
| FR-CMP-01 | Users can search for companies by name. | Must |
| FR-CMP-02 | Users can view a company overview and interview insights (process, tips, common questions). | Must |

### 4.8 Application tracker

| ID | Requirement | Priority |
|---|---|---|
| FR-TRK-01 | Users can add, edit and delete job applications. | Must |
| FR-TRK-02 | Each application has a status: saved, applied, interviewing, offer or rejected. | Must |
| FR-TRK-03 | Users can filter applications by status. | Must |
| FR-TRK-04 | An application can be linked to a saved job description or a company. | Should |

### 4.9 Dashboard

| ID | Requirement | Priority |
|---|---|---|
| FR-DSH-01 | The home screen shows recent interviews, average scores, the latest skills audit and match, and application counts by status. | Must |

### 4.10 Admin

| ID | Requirement | Priority |
|---|---|---|
| FR-ADM-01 | Admins can create, edit, publish, unpublish, archive and restore interview questions. Questions are never permanently deleted. | Must |
| FR-ADM-02 | Each question can have a type, difficulty, role and industry tags, an optional scoring rubric and an optional model answer. | Must |
| FR-ADM-03 | Admins can bulk-import questions from a CSV file. | Should |
| FR-ADM-04 | Admins can manage categories (roles and industries). | Must |
| FR-ADM-05 | Admins can create and edit skills audit templates. | Must |
| FR-ADM-06 | Admins can view users, change a user's role and disable accounts. Admins can't change their own role or disable themselves, and the last admin can't be removed. | Must |
| FR-ADM-07 | Admins can view basic platform stats: signups, active users, interviews completed, average scores. | Should |

---

## 5. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Platforms | iOS and Android (Flutter) plus a web version, all using the same API. |
| NFR-02 | Performance | Non-AI requests respond in under 500 ms under normal load. AI results that take longer show a progress state rather than freezing the screen. |
| NFR-03 | Security | All traffic uses HTTPS. Passwords are hashed. Admin features are restricted to admins. Users can only access their own data. |
| NFR-04 | Privacy | Resumes and answers are used only to provide the service. Deleting an account removes the user's data. |
| NFR-05 | Reliability | If the AI provider fails, the user sees a clear error and can retry without losing their work. |
| NFR-06 | Cost control | AI features are limited per user per day, checked when the user starts an action, to keep provider costs predictable since there is no paid tier. |
| NFR-07 | App store compliance | Sign in with Apple and in-app account deletion are included, as Apple requires. |
| NFR-08 | Maintainability | The API is documented with OpenAPI (Swagger), and the AI provider can be swapped without changing feature code. |

---

## 6. Constraints and Assumptions

- **Team:** Bill builds the backend; Joel builds the Flutter app.
- **Timeline:** A 10–12 week target.
- **AI provider:** To be confirmed. Solstice may already use one on its website.
- **Budget:** No paid tier, so infrastructure and AI costs need to stay modest.
- **Question bank content:** Solstice HQ supplies the initial questions.

---

## 7. Open Questions

| # | Question | Owner |
|---|---|---|
| 1 | Which AI provider will we use? | Juliet / Bill |
| 2 | Where does company data come from: AI-generated, an external source, or a list curated by admins? | Bill / Juliet |
| 3 | Who builds the admin UI: Flutter web, or a separate React admin? | Bill / Joel |
| 4 | Are interview questions bank-only, or can the AI ask follow-up questions? | Juliet |
| 5 | Who provides the initial question bank and skills audit content, and when? | Juliet |

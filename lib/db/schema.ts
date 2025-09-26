import { relations } from 'drizzle-orm';
import {
  boolean,
  doublePrecision,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { enumToPgEnum } from '@/lib/utils';

// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}
export enum SubmissionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  GRADED = 'graded',
  ERROR = 'error',
}
export enum ThinkingEffortType {
  BUDGET_TOKENS = 'budget_tokens',
  LOW_MEDIUM_HIGH = 'low_medium_high',
  LOW_HIGH = 'low_high',
}

export const userRoleEnum = pgEnum('role', enumToPgEnum(UserRole));
export const submissionStatusEnum = pgEnum('status', enumToPgEnum(SubmissionStatus));
export const thinkingEffortTypeEnum = pgEnum(
  'thinking_effort_type',
  enumToPgEnum(ThinkingEffortType),
);

// -----------------------------------------------------------------------------
// Auth
// -----------------------------------------------------------------------------

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: userRoleEnum('role').notNull().default(UserRole.USER),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

// -----------------------------------------------------------------------------
// AI
// -----------------------------------------------------------------------------

export const modelProviders = pgTable('model_providers', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  site: text('site'),
  image: text('image'),
  dashboardUrl: text('dashboard_url'),
  defaultBaseUrl: text('default_base_url').notNull(),
  defaultApiKey: text('default_api_key'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const models = pgTable(
  'models',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    providerId: text('provider_id')
      .notNull()
      .references(() => modelProviders.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    image: text('image'),
    baseUrl: text('base_url'),
    apiKey: text('api_key'),
    free: boolean('free').notNull().default(false),
    active: boolean('active').notNull().default(true),
    thinking: boolean('thinking').notNull().default(false),
    thinkingEffortType: thinkingEffortTypeEnum('thinking_effort_type'),
    rankingScore: integer('ranking_score').notNull().default(0),
    costPer1MInputTokens: doublePrecision('cost_per_1m_input_tokens').notNull().default(0),
    costPer1MOutputTokens: doublePrecision('cost_per_1m_output_tokens').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (model) => [uniqueIndex('name').on(model.providerId, model.name)],
);

export const userApiKeys = pgTable(
  'user_api_keys',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerId: text('provider_id')
      .notNull()
      .references(() => modelProviders.id, { onDelete: 'cascade' }),
    name: text('name'),
    apiKey: text('api_key').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [uniqueIndex('user_api_key_index').on(table.userId, table.providerId, table.apiKey)],
);

// -----------------------------------------------------------------------------
// Competition
// -----------------------------------------------------------------------------

export const competitions = pgTable('competitions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  overview: text('overview'),
  description: text('description'),
  examplePrompt: text('example_prompt'),
  maxInputTokens: integer('max_input_tokens').notNull().default(1024),
  maxOutputTokens: integer('max_output_tokens').notNull().default(1024),
  type: text('type').notNull().default('other'),
  slug: text('slug').notNull().unique(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  active: boolean('active').notNull().default(false),
  freeSubmissionsAllowed: boolean('free_submissions_allowed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const competitionModels = pgTable(
  'competition_models',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    competitionId: text('competition_id')
      .notNull()
      .references(() => competitions.id, { onDelete: 'cascade' }),
    modelId: text('model_id')
      .notNull()
      .references(() => models.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [uniqueIndex('competition_model_index').on(table.competitionId, table.modelId)],
);

export const questions = pgTable(
  'questions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    competitionId: text('competition_id')
      .notNull()
      .references(() => competitions.id, { onDelete: 'cascade' }),
    index: integer('index').notNull(),
    input: text('input').notNull(),
    expectedOutput: text('expected_output'),
    private: boolean('private').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (question) => [uniqueIndex('question_index').on(question.competitionId, question.index)],
);

export const submissions = pgTable(
  'submissions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    competitionId: text('competition_id')
      .notNull()
      .references(() => competitions.id, { onDelete: 'cascade' }),
    modelId: text('model_id')
      .notNull()
      .references(() => models.id, { onDelete: 'cascade' }),
    userApiKeyId: text('user_api_key_id').references(() => userApiKeys.id, {
      onDelete: 'set null',
    }),
    systemPrompt: text('system_prompt'),
    userPrompt: text('user_prompt'),
    thinkingEffort: text('thinking_effort'),
    thinkingBudgetTokens: integer('thinking_budget_tokens'),
    status: submissionStatusEnum('status').notNull().default(SubmissionStatus.PENDING),
    score: doublePrecision('score').default(0),
    publicScore: doublePrecision('public_score').default(0),
    inputTokens: integer('input_tokens'),
    outputTokens: integer('output_tokens'),
    cost: doublePrecision('cost'),
    isFinalSubmission: boolean('is_final_submission').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (submission) => [index('submission_index').on(submission.userId, submission.competitionId)],
);

export const submissionOutputs = pgTable(
  'submission_outputs',
  {
    submissionId: text('submission_id')
      .notNull()
      .references(() => submissions.id, { onDelete: 'cascade' }),
    questionId: text('question_id')
      .notNull()
      .references(() => questions.id, { onDelete: 'cascade' }),
    reasoning: text('reasoning'),
    output: text('output').notNull(),
    inputTokens: integer('input_tokens').notNull(),
    outputTokens: integer('output_tokens').notNull(),
    error: text('error'),
    score: doublePrecision('score'),
    latencyMs: integer('latency_ms').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [primaryKey({ name: 'id', columns: [table.submissionId, table.questionId] })],
);

// -----------------------------------------------------------------------------
// Relations
// -----------------------------------------------------------------------------

export const modelProvidersRelations = relations(modelProviders, ({ many }) => ({
  models: many(models),
}));

export const modelsRelations = relations(models, ({ one }) => ({
  modelProvider: one(modelProviders, {
    fields: [models.providerId],
    references: [modelProviders.id],
  }),
}));

export const userApiKeysRelations = relations(userApiKeys, ({ one }) => ({
  user: one(users, {
    fields: [userApiKeys.userId],
    references: [users.id],
  }),
  modelProvider: one(modelProviders, {
    fields: [userApiKeys.providerId],
    references: [modelProviders.id],
  }),
}));

export const competitionsRelations = relations(competitions, ({ many }) => ({
  questions: many(questions),
  submissions: many(submissions),
}));

export const competitionModelsRelations = relations(competitionModels, ({ one }) => ({
  competition: one(competitions, {
    fields: [competitionModels.competitionId],
    references: [competitions.id],
  }),
  model: one(models, {
    fields: [competitionModels.modelId],
    references: [models.id],
  }),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  competition: one(competitions, {
    fields: [questions.competitionId],
    references: [competitions.id],
  }),
  submissionOutputs: many(submissionOutputs),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  user: one(users, {
    fields: [submissions.userId],
    references: [users.id],
  }),
  userApiKey: one(userApiKeys, {
    fields: [submissions.userApiKeyId],
    references: [userApiKeys.id],
  }),
  competition: one(competitions, {
    fields: [submissions.competitionId],
    references: [competitions.id],
  }),
  model: one(models, {
    fields: [submissions.modelId],
    references: [models.id],
  }),
  submissionOutputs: many(submissionOutputs),
}));

export const submissionOutputsRelations = relations(submissionOutputs, ({ one }) => ({
  submission: one(submissions, {
    fields: [submissionOutputs.submissionId],
    references: [submissions.id],
  }),
  question: one(questions, {
    fields: [submissionOutputs.questionId],
    references: [questions.id],
  }),
}));

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type Competition = typeof competitions.$inferSelect;
export type User = typeof users.$inferSelect;
export type UserApiKey = typeof userApiKeys.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type ModelProvider = typeof modelProviders.$inferSelect;
export type Model = typeof models.$inferSelect;

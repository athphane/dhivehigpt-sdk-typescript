export { DhivehiGPT, DEFAULT_BASE_URL, DEFAULT_API_VERSION, API_KEY_ENV_VAR } from './client.js';
export type { DhivehiGPTOptions } from './client.js';

export { Voices } from './resources/voices.js';
export { TTS } from './resources/tts.js';
export { Subscriptions } from './resources/subscriptions.js';
export { Tasks } from './resources/tasks.js';

export {
  DhivehiGPTError,
  AuthenticationError,
  InsufficientCreditsError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
} from './errors.js';
export type { ApiErrorBody } from './errors.js';

export type {
  AgeGroup,
  Balance,
  BillingPeriod,
  CalculateTaskCostParams,
  CreateTTSAudioParams,
  DataResponse,
  Gender,
  GenerateTTSAudioParams,
  ListParams,
  ListTTSAudiosParams,
  ListTasksParams,
  ListVoicesParams,
  PaginatedResponse,
  PaginationLinks,
  PaginationMeta,
  PaginationMetaLink,
  Plan,
  Platform,
  Subscription,
  Task,
  TaskCostCalculation,
  TaskSort,
  TaskStatus,
  Team,
  TTSAudio,
  TTSSort,
  UnitCharged,
  UpdateTTSAudioParams,
  Usage,
  Voice,
  VoiceSort,
} from './types.js';

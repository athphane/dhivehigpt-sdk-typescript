/**
 * Shared pagination envelope returned by all "list" endpoints.
 */
export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMetaLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: PaginationMetaLink[];
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface DataResponse<T> {
  data: T;
}

/** Common pagination and sorting query parameters accepted by list endpoints. */
export interface ListParams {
  /** Number of results per page. Defaults to 10. Must be between 1 and 100. */
  per_page?: number;
  /** Page number to return. Must be at least 1. */
  page?: number;
}

export type Gender = 'female' | 'male';

export type AgeGroup =
  | 'ones'
  | 'tens'
  | 'twenties'
  | 'thirties'
  | 'fourties'
  | 'fifties'
  | 'sixties'
  | 'seventies';

export type UnitCharged =
  | 'character'
  | 'second'
  | 'image'
  | 'page'
  | 'every_3k_character';

export type Platform = 'chat' | 'stt' | 'tts' | 'ocr';

export interface Voice {
  name: string;
  slug: string;
  gender: Gender;
  age_group: AgeGroup;
  is_premium: boolean;
  audio_sample_url: string;
  unit_charged: UnitCharged;
  rate: number;
}

export type VoiceSort =
  | 'name'
  | '-name'
  | 'slug'
  | '-slug'
  | 'id'
  | '-id'
  | 'order_column'
  | '-order_column';

export interface ListVoicesParams extends ListParams {
  /** Search available voices by their name or slug. */
  search?: string;
  /** Which field to sort by. Prefix with "-" for descending order. Defaults to order_column. */
  sort?: VoiceSort;
  /** Only return premium or non-premium voices. */
  is_premium?: boolean;
  /** Only return voices with this gender. */
  gender?: Gender;
  /** Only return voices with this age group slug. */
  age_group?: AgeGroup;
}

export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Usage {
  uuid: string;
  task: string;
  unit: UnitCharged;
  status: TaskStatus | string;
  usage_units: number;
  charged_credits: number;
  duration: number;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface TTSAudio {
  uuid: string;
  title: string;
  text: string;
  normalized_text: string;
  duration: number;
  audio_url: string;
  voice: string;
  usage: Usage;
  created_at: string;
  updated_at: string;
}

export type TTSSort =
  | 'created_at'
  | '-created_at'
  | 'updated_at'
  | '-updated_at'
  | 'uuid'
  | '-uuid';

export interface ListTTSAudiosParams extends ListParams {
  /** Search TTS audios by title. */
  search?: string;
  /** Which field to sort by. Prefix with "-" for descending order. Defaults to -created_at. */
  sort?: TTSSort;
  /** Only return TTS audios generated with this voice slug. */
  voice?: string;
  /** Only return TTS audios created on or after this date and time. */
  date_from?: string;
  /** Only return TTS audios created on or before this date and time. */
  date_to?: string;
}

export interface CreateTTSAudioParams {
  /** The text to convert into speech. Must not be greater than 10000 characters. */
  text: string;
  /** The slug of the voice to be used for audio generation. */
  voice: string;
}

export interface UpdateTTSAudioParams {
  /** A new display title for the TTS audio. Must not be greater than 255 characters. */
  title: string;
}

export interface Plan {
  slug: string;
  name: string;
  duration_days: number;
}

export interface Subscription {
  plan: Plan;
  start_at: string;
  expire_at: string;
  duration_days: number;
  expires_in: number;
  is_annual_billing: boolean;
  /** Null when the plan has unlimited seats. */
  team_seats: number | null;
  unlimited_seats: boolean;
}

export interface BillingPeriod {
  period_no: number;
  credits: number;
  addon_credits: number;
  total_credits: number;
  used_credits: number;
  balance: number;
  start_at: string;
  expire_at: string;
  duration_days: number;
  expires_in: number;
}

export interface Team {
  uuid: string;
  name: string;
  name_dv: string;
  used_seats: number;
}

export interface Balance {
  team: Team;
  subscription: Subscription | null;
  billing_period: BillingPeriod | null;
}

export interface Task {
  name: string;
  description: string | null;
  slug: string;
  order_column: number;
  platform: Platform;
  unit_charged: UnitCharged;
  rate: number;
}

export type TaskSort = 'name' | '-name' | 'order_column' | '-order_column' | 'slug' | '-slug';

export interface ListTasksParams extends ListParams {
  /** Search available tasks by name. */
  search?: string;
  /** Which field to sort by. Prefix with "-" for descending order. Defaults to order_column. */
  sort?: TaskSort;
  /** Only return tasks belonging to this platform slug. */
  platform?: Platform;
}

export interface CalculateTaskCostParams {
  /** The slug of the available task to calculate. */
  task: string;
  /** The number of usage units to calculate. Must be at least 0. */
  units: number;
}

export interface TaskCostCalculation {
  task: Task;
  units: number;
  units_used: number;
  units_charged: number;
  charged_credits: number;
  credits_available: number;
  can_proceed: boolean;
}

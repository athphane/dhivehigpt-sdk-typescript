import type { HttpClient } from '../http.js';
import type {
  CreateTTSAudioParams,
  DataResponse,
  ListTTSAudiosParams,
  PaginatedResponse,
  TTSAudio,
  UpdateTTSAudioParams,
} from '../types.js';

export class TTS {
  constructor(private readonly http: HttpClient) {}

  /**
   * Returns a paginated list of API-created TTS audios belonging to the
   * current API key's team.
   */
  list(params: ListTTSAudiosParams = {}): Promise<PaginatedResponse<TTSAudio>> {
    return this.http.request<PaginatedResponse<TTSAudio>>('/tts', { query: params });
  }

  /**
   * Converts text into speech with an available voice, charges the API key
   * team for the usage, and associates the generated audio with the current
   * API key.
   */
  async create(params: CreateTTSAudioParams): Promise<TTSAudio> {
    const response = await this.http.request<DataResponse<TTSAudio>>('/tts', {
      method: 'POST',
      body: params,
    });
    return response.data;
  }

  /** Returns one API-created TTS audio belonging to the current API key's team. */
  async get(uuid: string): Promise<TTSAudio> {
    const response = await this.http.request<DataResponse<TTSAudio>>(
      `/tts/${encodeURIComponent(uuid)}`
    );
    return response.data;
  }

  /** Updates the title of an API-created TTS audio belonging to the current API key's team. */
  async update(uuid: string, params: UpdateTTSAudioParams): Promise<TTSAudio> {
    const response = await this.http.request<DataResponse<TTSAudio>>(
      `/tts/${encodeURIComponent(uuid)}`,
      { method: 'PUT', body: params }
    );
    return response.data;
  }

  /** Deletes an API-created TTS audio belonging to the current API key's team. */
  async delete(uuid: string): Promise<void> {
    await this.http.request<void>(`/tts/${encodeURIComponent(uuid)}`, { method: 'DELETE' });
  }
}

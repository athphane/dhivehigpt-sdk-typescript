import type { HttpClient } from '../http.js';
import type {
  CalculateTaskCostParams,
  DataResponse,
  ListTasksParams,
  PaginatedResponse,
  Task,
  TaskCostCalculation,
} from '../types.js';

export class Tasks {
  constructor(private readonly http: HttpClient) {}

  /**
   * Returns a paginated list of available tasks. Results can be searched,
   * filtered by platform slug, and sorted.
   */
  list(params: ListTasksParams = {}): Promise<PaginatedResponse<Task>> {
    return this.http.request<PaginatedResponse<Task>>('/tasks', { query: params });
  }

  /** Returns a single available task identified by its slug. */
  async get(slug: string): Promise<Task> {
    const response = await this.http.request<DataResponse<Task>>(
      `/tasks/${encodeURIComponent(slug)}`
    );
    return response.data;
  }

  /**
   * Calculates the credits charged for a number of units using the current
   * rate and charging unit of an available task.
   */
  calculate(params: CalculateTaskCostParams): Promise<TaskCostCalculation> {
    return this.http.request<TaskCostCalculation>('/tasks/calculate', {
      method: 'POST',
      body: params,
    });
  }
}

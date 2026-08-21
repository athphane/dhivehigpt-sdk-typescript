---
title: Tasks
sidebar_position: 4
---

# Tasks

Browse available tasks and calculate their credit cost. Corresponds to the `/v1/tasks` API endpoints.

## List tasks

Returns a paginated list of available tasks. Results can be searched, filtered by platform slug, and
sorted.

```typescript
const { data: tasks } = await client.tasks.list({ platform: 'tts' });
```

### Parameters

| Name       | Type     | Description                                                              |
|------------|----------|----------------------------------------------------------------------------|
| `search`   | `string` | Search available tasks by name.                                          |
| `per_page` | `number` | Number of results per page. Defaults to 10. Between 1 and 100.           |
| `page`     | `number` | Page number to return. At least 1.                                       |
| `sort`     | `string` | Field to sort by: `name`, `order_column`, or `slug`. Prefix with `-` for descending. |
| `platform` | `string` | Only return tasks belonging to this platform: `chat`, `stt`, `tts`, or `ocr`. |

## Get a task

Returns a single available task identified by its slug, including its platform and pricing details.

```typescript
const task = await client.tasks.get('audio_generation');
```

## Calculate task cost

Calculates the credits charged for a number of units using the current rate and charging unit of an
available task.

```typescript
const calculation = await client.tasks.calculate({
  task: 'audio_generation',
  units: 1000,
});

console.log(calculation.charged_credits, calculation.can_proceed);
```

### Parameters

| Name    | Type     | Required | Description                                        |
|---------|----------|----------|-------------------------------------------------------|
| `task`  | `string` | Yes      | The slug of the available task to calculate.       |
| `units` | `number` | Yes      | The number of usage units to calculate. At least 0. |

### Returns

```typescript
interface TaskCostCalculation {
  task: Task;
  units: number;
  units_used: number;
  units_charged: number;
  charged_credits: number;
  credits_available: number;
  can_proceed: boolean;
}
```

## The task object

```typescript
interface Task {
  name: string;
  description: string | null;
  slug: string;
  order_column: number;
  platform: 'chat' | 'stt' | 'tts' | 'ocr';
  unit_charged: string;
  rate: number;
}
```

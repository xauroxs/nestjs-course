import { TASK_STATUSES } from '../task.model';

export class FilterTasksDto {
  status?: TASK_STATUSES;
  search?: string;
}

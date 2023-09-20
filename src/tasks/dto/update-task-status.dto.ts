import { IsEnum } from 'class-validator';
import { TASK_STATUSES } from '../task.model';

export class UpdateTaskStatusDto {
  @IsEnum(TASK_STATUSES)
  status: TASK_STATUSES;
}

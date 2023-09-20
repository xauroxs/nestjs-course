import { IsEnum, IsOptional, IsString } from 'class-validator';

import { TASK_STATUSES } from '../task.model';

export class FilterTasksDto {
  @IsOptional()
  @IsEnum(TASK_STATUSES)
  status?: TASK_STATUSES;

  @IsOptional()
  @IsString()
  search?: string;
}

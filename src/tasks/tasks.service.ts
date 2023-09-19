import { Injectable } from '@nestjs/common';

import { TASK_STATUSES, Task } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private id: number = 0;

  getAllTasks() {
    return this.tasks;
  }

  createTask(title: string, description: string) {
    const newTask: Task = {
      id: `${this.id++}`,
      title,
      description,
      status: TASK_STATUSES.OPEN,
    };

    this.tasks.push(newTask);

    return newTask;
  }
}

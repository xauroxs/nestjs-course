import { Injectable, NotFoundException } from '@nestjs/common';

import { TASK_STATUSES, Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private id: number = 0;

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new NotFoundException(`There is no task with id ${id}`);
    }

    return task;
  }

  createTask(dto: CreateTaskDto): Task {
    const { title, description } = dto;

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

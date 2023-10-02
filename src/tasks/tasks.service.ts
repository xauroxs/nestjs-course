import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

import { TaskStatus } from './task-status.enum';

import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';

@Injectable()
export class TasksService {
  private logger = new Logger();

  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getTasks(dto: FilterTasksDto, user: User): Promise<Task[]> {
    const { status, search } = dto;

    const query = this.tasksRepository.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    try {
      const tasks = await query.getMany();

      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }". Filters: ${JSON.stringify(dto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    try {
      const task = await this.tasksRepository.findOneBy({ id, user });

      if (!task) {
        throw new NotFoundException(`Task with ID "${id}" not found.`);
      }

      return task;
    } catch (error) {
      this.logger.error(
        `Failed to get task with ID "${id}" for user "${user.username}"`,
        error.stack,
      );

      throw new InternalServerErrorException();
    }
  }

  async createTask(dto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = dto;

    try {
      const task = this.tasksRepository.create({
        title,
        description,
        status: TaskStatus.OPEN,
        user,
      });

      await this.tasksRepository.save(task);

      return task;
    } catch (error) {
      this.logger.error(
        `Failed to create a task for user "${
          user.username
        }" with data "${JSON.stringify(dto)}"`,
        error.stack,
      );

      throw new InternalServerErrorException();
    }
  }

  async deleteTask(id: string, user: User): Promise<void> {
    try {
      const result = await this.tasksRepository.delete({ id, user });

      if (result.affected === 0) {
        throw new NotFoundException(`Task with ID "${id}" not found.`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to delete a task with ID "${id}" for user "${user.username}"`,
        error.stack,
      );

      throw new InternalServerErrorException();
    }
  }

  async updateStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;

    try {
      await this.tasksRepository.save(task);

      return task;
    } catch (error) {
      this.logger.error(
        `Failed to update status of a task with ID "${id}" to "${status}" for user "${user.username}"`,
        error.stack,
      );

      throw new InternalServerErrorException();
    }
  }
}

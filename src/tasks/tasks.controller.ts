import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { TasksService } from './tasks.service';

import { User } from 'src/auth/user.entity';
import { Task } from './task.entity';

import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() dto: FilterTasksDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrieves all tasks. Filters: ${JSON.stringify(
        dto,
      )}`,
    );

    return this.tasksService.getTasks(dto, user);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" retrieves a task with ID "${id}"`,
    );

    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  createTask(@Body() dto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" creates a task. Task data: "${JSON.stringify(
        dto,
      )}"`,
    );

    return this.tasksService.createTask(dto, user);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    this.logger.verbose(
      `User "${user.username}" deletes a task with ID "${id}"`,
    );

    return this.tasksService.deleteTask(id, user);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = dto;

    this.logger.verbose(
      `User "${user.username}" changes status of a task with ID "${id}" to "${status}"`,
    );

    return this.tasksService.updateStatus(id, status, user);
  }
}

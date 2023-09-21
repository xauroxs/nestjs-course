import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { TASK_STATUSES } from './task.model';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TASK_STATUSES;
}

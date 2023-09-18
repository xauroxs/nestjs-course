export interface Task {
  id: string;
  title: string;
  description: string;
  status: TASK_STATUSES;
}

export enum TASK_STATUSES {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
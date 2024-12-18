export interface Holiday {
  id: string;
  name: string;
  date: Date;
  description?: string;
  isRecurring?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HolidayInput {
  name: string;
  date: Date;
  description?: string;
  isRecurring?: boolean;
}

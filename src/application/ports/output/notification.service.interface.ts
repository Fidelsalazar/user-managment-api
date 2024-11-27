export interface INotificationService {
    notify(userId: string, operation: string): Promise<void>;
  }
  
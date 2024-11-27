import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { INotificationService } from '../../ports/output/notification.service.interface';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('INotificationService')
    private readonly notificationService: INotificationService
  ) {}

  async execute(id: string) {
    await this.userRepository.delete(id);
    await this.notificationService.notify(id, 'DELETE');
  }
}

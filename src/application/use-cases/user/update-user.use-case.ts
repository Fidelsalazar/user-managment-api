import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { INotificationService } from '../../ports/output/notification.service.interface';
import { NotificationGateway } from 'src/infraestructure/websocket/notification.gateway';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('INotificationService')
    private readonly notificationService: INotificationService,
  ) {}

  async execute(id: string, userData: any) {
    const updatedUser = await this.userRepository.update(id, userData);
    await this.notificationService.notify(id, 'UPDATE');
    return updatedUser;
  }
}

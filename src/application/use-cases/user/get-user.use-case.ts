import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { INotificationService } from 'src/application/ports/output/notification.service.interface';

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('INotificationService')
    private readonly notificationService: INotificationService
  ) {}

  async execute(id?: string): Promise<User[] | User> {
    if (id) {
      await this.notificationService.notify(id, 'READ');
      return this.userRepository.findById(id);
    }

    await this.notificationService.notify('system', 'READ_ALL');
    return this.userRepository.findAll();
    
  }

}

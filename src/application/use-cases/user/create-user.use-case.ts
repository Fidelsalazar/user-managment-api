import { Inject, Injectable } from "@nestjs/common";
import { INotificationService } from "src/application/ports/output/notification.service.interface";
import { User } from "src/domain/entities/user.entity";
import { IUserRepository } from "src/domain/repositories/user.repository.interface";

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('INotificationService')
    private readonly notificationService: INotificationService
  ) {}

  async execute(userData: User) {
    const user = await this.userRepository.create(userData);
    await this.notificationService.notify(user.id, 'CREATE');
    return user;
  }
}
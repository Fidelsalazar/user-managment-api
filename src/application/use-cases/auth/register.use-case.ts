import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { INotificationService } from '../../ports/output/notification.service.interface';

@Injectable()
export class RegisterUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
        @Inject('IUserRepository')
        private readonly notificationService: INotificationService
    ) {}

    async execute(username: string, email: string, password: string): Promise<User> {
        const user = User.create(username, email, password);
        const createdUser = await this.userRepository.create(user);
        
        await this.notificationService.notify(
            'USER_CREATED',
            `El usuario ${username} se ha registrado`
        );

        return createdUser;
    }
}

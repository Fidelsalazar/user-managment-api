import { Inject, Injectable } from "@nestjs/common";
import { NotificationGateway } from '../../../infraestructure/websocket/notification.gateway';
import { ITrazaRepository } from "src/domain/repositories/traza.repository.interface";
import { IUserRepository } from "src/domain/repositories/user.repository.interface";

@Injectable()
export class LogoutUseCase {
    constructor(
        @Inject('ITrazaRepository')
        private readonly trazaRepository: ITrazaRepository,
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
        private readonly notificationGateway: NotificationGateway
    ){}

    async execute(userId: string): Promise<void> {
        await this.trazaRepository.updateLastLogout(userId);    
        this.notificationGateway.emitUserOperation( await (await this.userRepository.findById(userId)).name, `cierre de sesión`);
    }
}

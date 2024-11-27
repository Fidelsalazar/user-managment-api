import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { GetUsersUseCase } from '../../../application/use-cases/user/get-user.use-case';
import { UpdateUserUseCase } from '../../../application/use-cases/user/update-user.use-case';
import { DeleteUserUseCase } from '../../../application/use-cases/user/delete-user.use-case';
import { MongoDBUserRepository } from '../../../infraestructure/persistence/mongodb/repositories/mongodb-user.repository';
import { NotificationGateway } from '../../../infraestructure/websocket/notification.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../../infraestructure/persistence/mongodb/schemas/user.schema';
import { WebsocketModule } from '../../..//interfaces/websocket/websocket.module';
import { AuthModule } from './auth.module';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    WebsocketModule,
    AuthModule
  ],
  controllers: [UserController],
  providers: [
    GetUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    NotificationGateway,
    JwtAuthGuard,
    {
      provide: 'IUserRepository',
      useClass: MongoDBUserRepository,
    },
    {
      provide: 'INotificationService',
      useClass: NotificationGateway,
    }
  ],
  exports: ['IUserRepository']
})
export class UserModule {}
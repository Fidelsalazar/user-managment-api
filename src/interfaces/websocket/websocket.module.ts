import { Module } from '@nestjs/common';
import { NotificationGateway } from '../../infraestructure/websocket/notification.gateway';
import { UserEventsGateway } from './events/user-events.gateway';

@Module({
  providers: [
    {
      provide: 'INotificationService',
      useClass: UserEventsGateway
    },
    NotificationGateway
  ],
  exports: ['INotificationService', NotificationGateway],
})

export class WebsocketModule {}

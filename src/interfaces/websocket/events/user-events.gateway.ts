import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { INotificationService } from '../../../application/ports/output/notification.service.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UserEventsGateway implements INotificationService {
  private readonly logger = new Logger(UserEventsGateway.name);
  
  @WebSocketServer()
  server: Server;

  async notify(userId: string, operation: string): Promise<void> {
    const payload = {
      userId,
      operation,
      timestamp: new Date()
    };
    
    this.logger.log(`Emitting user operation: ${JSON.stringify(payload)}`);
    this.server.emit('userOperation', payload);
  }
}


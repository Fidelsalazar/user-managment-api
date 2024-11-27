import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { RegisterDto } from '../../../interfaces/http/dtos/auth/register.dto';
import { LoginDto } from '../../../interfaces/http/dtos/auth/login.dto';
import { NotificationGateway } from '../../../infraestructure/websocket/notification.gateway';
import { logger } from '../../../infraestructure/logging/ winston.logger';


@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly notificationGateway: NotificationGateway
  ) {}

    
      async register(registerDto: RegisterDto) {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        
        const newUser = new User(
          undefined, // MongoDB will generate the ID
          registerDto.email,
          hashedPassword,
          registerDto.name,
          new Date(),
          new Date()
        );
        
        const user = await this.userRepository.create(newUser);
    
        logger.info(`User registered: ${user.email}`);
        this.notificationGateway.emitUserOperation(user.name, 'registro');
    
        return user;
      }
    
      async login(loginDto: LoginDto) {
        const user = await this.userRepository.findByEmail(loginDto.email);
        if (!user) {
          throw new UnauthorizedException('Invalid credentials');
        }
    
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid credentials');
        }
    
        const token = this.jwtService.sign({ 
          sub: user.id, 
          email: user.email 
        });
    
        logger.info(`User logged in: ${user.email}`);
        this.notificationGateway.emitUserOperation(user.name, 'inicio de sesión');
    
        return { token, user };
      }
}
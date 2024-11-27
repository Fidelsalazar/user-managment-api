import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../controllers/auth.controller';
import { LoginUseCase } from '../../../application/use-cases/auth/login.use-case';
import { RegisterUseCase } from '../../../application/use-cases/auth/register.use-case';
import { MongoDBUserRepository } from '../../../infraestructure/persistence/mongodb/repositories/mongodb-user.repository';
import { MongoUserTrazaRepository } from '../../../infraestructure/persistence/mongodb/repositories/mongodb-user-traza.repository';
import { NotificationGateway } from '../../../infraestructure/websocket/notification.gateway';
import { User, UserSchema } from '../../../infraestructure/persistence/mongodb/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from '../../../shared/config/jwt.config';
import { LogoutUseCase } from '../../../application/use-cases/auth/logout.use-case';
import { Traza, TrazaSchema } from '../../../infraestructure/persistence/mongodb/schemas/traza.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Traza.name, schema: TrazaSchema}]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    })
  ],
  controllers: [AuthController],
  providers: [
    LogoutUseCase,
    LoginUseCase,
    RegisterUseCase,
    NotificationGateway,
    {
      provide: 'IUserRepository',
      useClass: MongoDBUserRepository,
    },
    {
      provide: 'ITrazaRepository',
      useClass: MongoUserTrazaRepository,
    }
  ],
  exports: [
    'IUserRepository', 
    JwtModule
  ]
})
export class AuthModule {}

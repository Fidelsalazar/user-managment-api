import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { LoginUseCase } from '../../../application/use-cases/auth/login.use-case';
import { LogoutUseCase } from '../../../application/use-cases/auth/logout.use-case';
import { NotificationGateway } from '../../../infraestructure/websocket/notification.gateway';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/domain/entities/user.entity';

describe('AuthController', () => {
    let controller: AuthController;
    let loginUseCase: LoginUseCase;
    let logoutUseCase: LogoutUseCase;

    const mockUserRepository = {
        findById: jest.fn()
    };

    const mockNotificationGateway = {
        emitUserOperation: jest.fn()
    };

    const mockJwtService = {
        verify: jest.fn(),
        sign: jest.fn()
    };

    const mockConfigService = {
        get: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: LoginUseCase,
                    useValue: {
                        register: jest.fn(),
                        login: jest.fn(),
                    },
                },
                {
                    provide: LogoutUseCase,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService
                },
                {
                    provide: NotificationGateway,
                    useValue: {
                        emitUserOperation: jest.fn()
                    }
                }
            ],
        }).compile();
        
        controller = module.get<AuthController>(AuthController);
        loginUseCase = module.get<LoginUseCase>(LoginUseCase);
        logoutUseCase = module.get<LogoutUseCase>(LogoutUseCase);
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const registerDto = {
                name: 'Test User',
                email: 'test@test.com',
                password: 'password123'
            };
    
            const mockRegisteredUser = {
                id: '1',
                ...registerDto,
                createdAt: new Date(),
                updatedAt: new Date()
            };
    
            jest.spyOn(loginUseCase, 'register').mockResolvedValue(mockRegisteredUser);
    
            const result = await controller.register(registerDto);
    
            expect(loginUseCase.register).toHaveBeenCalledWith(registerDto);
            expect(result).toEqual(mockRegisteredUser);
        });
    });
    
    describe('login', () => {
        it('should login user successfully', async () => {
            const loginDto = {
                email: 'test@test.com',
                password: 'password123'
            };
    
            const mockUser: User = {
                id: '1',
                name: 'Test User',
                email: 'test@test.com',
                password: 'hashedPassword123',
                createdAt: new Date(),
                updatedAt: new Date()
            };
    
            const mockLoginResponse = {
                user: mockUser,
                token: 'jwt-token-123'
            };
    
            const mockResponse = {
                cookie: jest.fn(),
                json: jest.fn()
            } as unknown as Response;
    
            jest.spyOn(loginUseCase, 'login').mockResolvedValue(mockLoginResponse);
    
            await controller.login(loginDto, mockResponse);
    
            expect(loginUseCase.login).toHaveBeenCalledWith(loginDto);
            expect(mockResponse.cookie).toHaveBeenCalledWith(
                'jwt',
                mockLoginResponse.token,
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 24 * 60 * 60 * 1000
                }
            );
            expect(mockResponse.json).toHaveBeenCalledWith({
                user: mockLoginResponse.user,
                token: mockLoginResponse.token,
                message: 'Login exitoso'
            });
        });
    });
    
    describe('logout', () => {
        it('should logout user successfully', async () => {
            const userId = '1';
            const mockUser = {
                id: userId,
                name: 'Test User',
                email: 'test@test.com'
            };
    
            // Configurar el mock para el LogoutUseCase
            const mockLogoutExecute = jest.fn().mockImplementation(() => {
                mockNotificationGateway.emitUserOperation(mockUser.name, 'cierre de sesión');
            });
            
            jest.spyOn(logoutUseCase, 'execute').mockImplementation(mockLogoutExecute);
    
            const mockResponse = {
                clearCookie: jest.fn(),
                setHeader: jest.fn(),
                json: jest.fn(),
            } as unknown as Response;
    
            await controller.logout(userId, mockResponse);
    
            expect(logoutUseCase.execute).toHaveBeenCalledWith(userId);
            expect(mockNotificationGateway.emitUserOperation).toHaveBeenCalledWith(
                'Test User',
                'cierre de sesión'
            );
            expect(mockResponse.clearCookie).toHaveBeenCalledWith(
                'jwt',
                expect.any(Object)
            );
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Sesión cerrada exitosamente',
                clearToken: true
            });
        });
    });
});
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { GetUsersUseCase } from '../../../application/use-cases/user/get-user.use-case';
import { UpdateUserUseCase } from '../../../application/use-cases/user/update-user.use-case';
import { DeleteUserUseCase } from '../../../application/use-cases/user/delete-user.use-case';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('UserController', () => {
    let controller: UserController;
    let getUsersUseCase: GetUsersUseCase;
    let updateUserUseCase: UpdateUserUseCase;
    let deleteUserUseCase: DeleteUserUseCase;

    const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@test.com',
        password: 'hashedPassword123',
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: GetUsersUseCase,
                    useValue: {
                        execute: jest.fn()
                    }
                },
                {
                    provide: UpdateUserUseCase,
                    useValue: {
                        execute: jest.fn()
                    }
                },
                {
                    provide: DeleteUserUseCase,
                    useValue: {
                        execute: jest.fn()
                    }
                },
                {
                    provide: JwtService,
                    useValue: {
                        verify: jest.fn()
                    }
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn()
                    }
                }
            ]
        }).compile();

        controller = module.get<UserController>(UserController);
        getUsersUseCase = module.get<GetUsersUseCase>(GetUsersUseCase);
        updateUserUseCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
        deleteUserUseCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const users = [mockUser];
            jest.spyOn(getUsersUseCase, 'execute').mockResolvedValue(users);

            const result = await controller.findAll();

            expect(result).toEqual(users);
            expect(getUsersUseCase.execute).toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('should return a single user', async () => {
            jest.spyOn(getUsersUseCase, 'execute').mockResolvedValue(mockUser);

            const result = await controller.findById('1');

            expect(result).toEqual(mockUser);
            expect(getUsersUseCase.execute).toHaveBeenCalledWith('1');
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const updateUserDto = {
                name: 'Updated Name',
                email: 'updated@test.com'
            };

            const updatedUser = {
                ...mockUser,
                ...updateUserDto
            };

            jest.spyOn(updateUserUseCase, 'execute').mockResolvedValue(updatedUser);

            const result = await controller.update('1', updateUserDto);

            expect(result).toEqual(updatedUser);
            expect(updateUserUseCase.execute).toHaveBeenCalledWith('1', updateUserDto);
        });
    });

    describe('delete', () => {
        it('should delete a user', async () => {
            jest.spyOn(deleteUserUseCase, 'execute').mockResolvedValue();
    
            const result = await controller.delete('1');
    
            expect(result).toBeUndefined();
            expect(deleteUserUseCase.execute).toHaveBeenCalledWith('1');
        });
    });
});
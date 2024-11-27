import { Controller, Get, Put, Delete, UseGuards, Param, Body } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUsersUseCase } from '../../../application/use-cases/user/get-user.use-case';
import { UpdateUserUseCase } from '../../../application/use-cases/user/update-user.use-case';
import { DeleteUserUseCase } from '../../../application/use-cases/user/delete-user.use-case';
import { UpdateUserDto } from '../dtos/user/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(
        private readonly getUsersUseCase: GetUsersUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Obtener todos los usuarios' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente' })
    async findAll() {
        return await this.getUsersUseCase.execute();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener todos los usuarios' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente' })
    @ApiParam({ name: 'id', description: 'ID del usuario' })
    async findById(@Param('id') id: string,){
        return await this.getUsersUseCase.execute(id)
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar un usuario' })
    @ApiParam({ 
        name: 'id', 
        description: 'ID del usuario' 
    })
    @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return await this.updateUserUseCase.execute(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un usuario' })
    @ApiParam({ name: 'id', description: 'ID del usuario' })
    @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    async delete(@Param('id') id: string) {
        return await this.deleteUserUseCase.execute(id);
    }
}

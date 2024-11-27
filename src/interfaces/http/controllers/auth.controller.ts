import { Controller, Post, Body, Res, UseGuards, Req, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { RegisterDto } from '../dtos/auth/register.dto';
import { LoginDto } from '../dtos/auth/login.dto';
import { LoginUseCase } from '../../../application/use-cases/auth/login.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LogoutUseCase } from '../../../application/use-cases/auth/logout.use-case';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: LoginUseCase,
        private readonly logoutUseCase: LogoutUseCase
    ) {}

    @Post('register')
    @ApiOperation({ summary: 'Registrar nuevo usuario' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        const { token, user } = await this.authService.login(loginDto);
        
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.json({ 
          user,
          token, 
          message: 'Login exitoso'
        });
    }


    @Post('logout/:id')
    @ApiOperation({ summary: 'Cerrar sesión' })
    @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiParam({ name: 'id', description: 'ID del usuario'})
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async logout(@Param('id') req: string, @Res() res: Response) {
        await this.logoutUseCase.execute(req);
        
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        res.setHeader('Authorization', '');
        res.setHeader('Clear-Site-Data', '"cookies", "storage"');

        return res.json({
            message: 'Sesión cerrada exitosamente',
            clearToken: true
        });
    }
}

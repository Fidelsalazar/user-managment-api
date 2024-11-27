import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('jwt.secret')
      });
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  private extractToken(request: any): string | null {
    if (request.cookies?.jwt) {
      return request.cookies.jwt; // Fixed typo: cookie -> cookies
    }

    const bearerToken = request.headers.authorization;
    if (bearerToken && bearerToken.startsWith('Bearer ')) {
      return bearerToken.substring(7);
    }
    
    return null;
  }
}
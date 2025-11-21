import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(email: string, password: string, name?: string) {
    // Vérifier si l'utilisateur existe déjà
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new UnauthorizedException('User already exists');
    }

    // Créer l'utilisateur (pour l'instant, on ignore le password - à améliorer plus tard)
    const user = await this.prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
      },
    });

    return this.generateToken(user.id, user.email);
  }

  async login(email: string, password: string) {
    // Pour l'instant, on ignore le password - à améliorer plus tard
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user.id, user.email);
  }

  private generateToken(userId: string, email: string) {
    const secret = process.env.JWT_ACCESS_SECRET || 'default-secret-change-in-production';
    const token = jwt.sign(
      {
        sub: userId,
        email: email,
      },
      secret,
      { expiresIn: '7d' }
    );

    return {
      accessToken: token,
      user: {
        id: userId,
        email: email,
      },
    };
  }
}


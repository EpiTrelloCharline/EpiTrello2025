import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }

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

  async login(email: string) {
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

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    
    // Pour des raisons de sécurité, on retourne toujours un succès même si l'email n'existe pas
    if (!user) {
      return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' };
    }

    // Générer un token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

    // Sauvegarder le token dans la base de données
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // En production, on enverrait un email avec le lien
    // Pour le développement, on retourne le token directement
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    
    console.log(`[DEV] Reset password link for ${email}: ${resetUrl}`);

    return { 
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé.',
      // En dev seulement - à retirer en production
      resetToken,
      resetUrl,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    // Trouver l'utilisateur avec ce token
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Token invalide ou expiré');
    }

    // Mettre à jour le mot de passe et supprimer le token
    // Note: En production, il faudrait hasher le mot de passe avec bcrypt
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: newPassword, // TODO: Hasher avec bcrypt en production
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Mot de passe réinitialisé avec succès' };
  }

  async validateResetToken(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Token invalide ou expiré');
    }

    return { valid: true, email: user.email };
  }
}


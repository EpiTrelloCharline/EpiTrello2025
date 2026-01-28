import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) { }

  async register(email: string, password: string, name?: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        password: hashedPassword,
      },
    });

    return this.generateToken(user.id, user.email);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password with bcrypt
    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user.id, user.email);
  }

  private generateToken(userId: string, email: string) {
    const secret = process.env.JWT_SECRET || 'default-secret-change-in-production';
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

    // Return success even if user not found to prevent enumeration
    if (!user) {
      return { message: 'Si cet email existe, un code de réinitialisation a été envoyé.' };
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the code
    const saltRounds = 10;
    const hashCode = await bcrypt.hash(code, saltRounds);

    // Set expiry to 15 minutes
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetCode: hashCode,
        resetCodeExpires: expires,
      },
    });

    // Send email with unhashed code
    try {
      await this.mailService.sendPasswordResetEmail(email, code);
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (e) {
      this.logger.error('Failed to send email:', e);
      // Don't throw in dev to allow testing, but log the error
    }

    return { message: 'Si cet email existe, un code de réinitialisation a été envoyé.' };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.resetCode || !user.resetCodeExpires) {
      throw new BadRequestException('Code invalide ou expiré');
    }

    if (new Date() > user.resetCodeExpires) {
      throw new BadRequestException('Code expiré');
    }

    const isMatch = await bcrypt.compare(code, user.resetCode);
    if (!isMatch) {
      throw new BadRequestException('Code invalide');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetCode: null,
        resetCodeExpires: null, // Clear expiry too
      },
    });

    return { message: 'Mot de passe réinitialisé avec succès' };
  }

  async validateResetToken(token: string) {
    // Deprecated/Unused in new flow but keeping method signature just in case
    // Or refactoring to validate code? logic is specific to code+email now.
    // Since this was likely for the link-based approach, I'll remove the body or throw error
    throw new BadRequestException('Use reset-password with code instead');
  }
}


import { PrismaService } from '../prisma.service';
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    register(email: string, password: string, name?: string): Promise<{
        accessToken: any;
        user: {
            id: string;
            email: string;
        };
    }>;
    login(email: string): Promise<{
        accessToken: any;
        user: {
            id: string;
            email: string;
        };
    }>;
    private generateToken;
}

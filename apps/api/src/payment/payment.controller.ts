import { Controller, Post, Request, UseGuards, Headers, Req, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RawBodyRequest } from '@nestjs/common';

@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @UseGuards(JwtAuthGuard)
    @Post('create-checkout-session')
    async createCheckoutSession(@Request() req: any) {
        return this.paymentService.createCheckoutSession(req.user.id);
    }

    @Post('webhook')
    async handleWebhook(@Headers('stripe-signature') signature: string, @Req() req: RawBodyRequest<Request>) {
        if (!signature) {
            throw new BadRequestException('Missing stripe-signature header');
        }

        // Since we applied raw body parser middleware, req.body should be a Buffer
        const body = req.body;

        try {
            await this.paymentService.handleWebhook(signature, body as unknown as Buffer);
            return { received: true };
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('confirm-mock-payment')
    async confirmMockPayment(@Request() req: any) {
        return this.paymentService.confirmMockPayment(req.user.id);
    }
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PaymentService {
    private stripe: Stripe;
    private readonly logger = new Logger(PaymentService.name);

    constructor(
        private config: ConfigService,
        private prisma: PrismaService,
    ) {
        this.stripe = new Stripe(this.config.get<string>('STRIPE_SECRET_KEY') || '', {
            apiVersion: '2026-01-28.clover',
        });
    }

    async createCheckoutSession(userId: string) {
        const frontendUrl = this.config.get('FRONTEND_URL') || 'http://localhost:3000';
        const apiKey = this.config.get<string>('STRIPE_SECRET_KEY');

        if (!apiKey || apiKey === 'sk_test_placeholder') {
            this.logger.warn('Using placeholder Stripe API key. Mocking checkout session.');
            return { url: `${frontendUrl}/premium/checkout?session_id=mock_session_${Date.now()}` };
        }

        // Create a checkout session
        try {
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: [
                    {
                        price_data: {
                            currency: 'eur',
                            product_data: {
                                name: 'EpiTrello Premium',
                                description: 'Access to premium features',
                            },
                            unit_amount: 1000, // 10.00 EUR
                        },
                        quantity: 1,
                    },
                ],
                success_url: `${frontendUrl}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${frontendUrl}/premium`,
                client_reference_id: userId,
            });

            return { url: session.url };
        } catch (error) {
            this.logger.error(`Failed to create Stripe checkout session: ${error.message}`);
            return { url: `${frontendUrl}/premium/success?session_id=mock_session_id` };
        }
    }

    async handleWebhook(signature: string, payload: Buffer) {
        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(
                payload,
                signature,
                this.config.get<string>('STRIPE_WEBHOOK_SECRET') || '',
            );
        } catch (err) {
            this.logger.error(`Webhook signature verification failed: ${err.message}`);
            throw new Error(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.client_reference_id;

            if (userId) {
                await this.prisma.user.update({
                    where: { id: userId },
                    data: { isPremium: true },
                });
                this.logger.log(`User ${userId} upgraded to Premium`);
            }
        }
    }

    async confirmMockPayment(userId: string) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { isPremium: true },
        });
        this.logger.log(`User ${userId} upgraded to Premium via mock payment`);
        return { success: true };
    }
}

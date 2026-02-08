import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PrismaService } from '../prisma.service';
import { ConfigModule } from '@nestjs/config';
import * as bodyParser from 'body-parser';

@Module({
    imports: [ConfigModule],
    controllers: [PaymentController],
    providers: [PaymentService],
})
export class PaymentModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(bodyParser.raw({ type: 'application/json' }))
            .forRoutes({ path: 'payment/webhook', method: RequestMethod.POST });
    }
}

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('API Basic Tests (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('API Health', () => {
        it('should have cards endpoint', () => {
            return request(app.getHttpServer())
                .get('/cards')
                .expect((res) => {
                    // Expect either 401 (unauthorized) or 400 (missing listId)
                    expect([400, 401]).toContain(res.status);
                });
        });

        it('should have boards endpoint', () => {
            return request(app.getHttpServer())
                .get('/boards')
                .expect((res) => {
                    // Expect either 401 (unauthorized) or 400 (missing query params)
                    expect([400, 401]).toContain(res.status);
                });
        });

        it('should have labels endpoint', () => {
            return request(app.getHttpServer())
                .get('/labels/test-id')
                .expect((res) => {
                    // Expect 401 (unauthorized) or 404 (not found)
                    expect([401, 404]).toContain(res.status);
                });
        });
    });

    describe('Validation Tests', () => {
        it('should reject POST /cards without authentication', () => {
            return request(app.getHttpServer())
                .post('/cards')
                .send({ title: 'Test Card' })
                .expect(401);
        });

        it('should reject POST /boards without authentication', () => {
            return request(app.getHttpServer())
                .post('/boards')
                .send({ name: 'Test Board' })
                .expect(401);
        });

        it('should reject POST /boards/:id/labels without authentication', () => {
            return request(app.getHttpServer())
                .post('/boards/test-id/labels')
                .send({ name: 'Bug', color: '#FF0000' })
                .expect(401);
        });
    });

    describe('Permission Tests', () => {
        it('should require authentication for protected routes', async () => {
            const routes = [
                { method: 'get', path: '/boards' },
                { method: 'post', path: '/boards' },
                { method: 'get', path: '/cards' },
                { method: 'post', path: '/cards' },
            ];

            for (const route of routes) {
                const response = await request(app.getHttpServer())[route.method](route.path);
                // All protected routes should require authentication
                expect([400, 401]).toContain(response.status);
            }
        });
    });
});

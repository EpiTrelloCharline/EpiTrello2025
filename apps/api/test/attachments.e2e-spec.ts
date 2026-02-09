
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

describe('Attachments (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let jwtToken: string;
    let cardId: string;
    let uploadedCurrentPath: string;

    const testFilePath = path.join(__dirname, 'test-attachment.txt');

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        prisma = app.get<PrismaService>(PrismaService);
        await prisma.cleanDb(); // Ensure cleanDb matches your PrismaService helper

        // Create user and get token
        const authResponse = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'test-attachments@example.com',
                password: 'password123',
                name: 'Test Attachments',
            });

        // If register automatically logs in or returns token
        if (authResponse.body.access_token) {
            jwtToken = authResponse.body.access_token;
        } else {
            const loginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'test-attachments@example.com',
                    password: 'password123',
                });
            jwtToken = loginResponse.body.access_token;
        }

        // Create Workspace
        const workspaceRes = await request(app.getHttpServer())
            .post('/workspaces')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({ name: 'Attachment WS' });
        const workspaceId = workspaceRes.body.id;

        // Create Board
        const boardRes = await request(app.getHttpServer())
            .post(`/boards`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({ title: 'Attachment Board', workspaceId: workspaceId });
        const boardId = boardRes.body.id;

        // Create List
        const listRes = await request(app.getHttpServer())
            .post(`/lists`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({ title: 'Attachment List', boardId: boardId });
        const listId = listRes.body.id;

        // Create Card
        const cardRes = await request(app.getHttpServer())
            .post(`/cards`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({ title: 'Attachment Card', listId: listId });
        cardId = cardRes.body.id;

        // Create dummy file
        fs.writeFileSync(testFilePath, 'Hello World Attachment Content');
    });

    afterAll(async () => {
        // Cleanup test file
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
        // Cleanup uploaded file if test didn't delete it
        if (uploadedCurrentPath && fs.existsSync(uploadedCurrentPath)) {
            // Depending on where it was uploaded.
            // If local storage, it's in root/uploads
            try {
                fs.unlinkSync(uploadedCurrentPath);
            } catch (e) { }
        }

        await prisma.cleanDb();
        await app.close();
    });

    it('/cards/:id/attachments (POST) - should upload a file', async () => {
        return request(app.getHttpServer())
            .post(`/cards/${cardId}/attachments`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .attach('file', testFilePath)
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('id');
                expect(res.body.name).toBe('test-attachment.txt');
                expect(res.body.cardId).toBe(cardId);
                expect(res.body.url).toBeDefined();
                uploadedCurrentPath = path.join(process.cwd(), res.body.url); // Assuming local storage returns relative path
            });
    });

    it('/cards/:id/attachments (GET) - should get attachments', async () => {
        // First upload one if previous failed? 
        // Assuming previous passed.

        return request(app.getHttpServer())
            .get(`/cards/${cardId}/attachments`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(200)
            .expect((res) => {
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBeGreaterThan(0);
                expect(res.body[0].name).toBe('test-attachment.txt');
            });
    });

    it('/uploads/... (GET) - should serve the uploaded file (Static Serve)', async () => {
        // We need the URL from the first test
        const listRes = await request(app.getHttpServer())
            .get(`/cards/${cardId}/attachments`)
            .set('Authorization', `Bearer ${jwtToken}`);

        const attachment = listRes.body[0];
        // The url stored in DB might be "uploads/filename.txt" (from LocalStorageService which returns file.path)
        // or "attachments/..." (from S3)
        // file.path from multer diskStorage is usually "uploads\filename..." on windows or "uploads/..."

        // If LocalStorageService returns file.path, it is relative to cwd.
        // ServeStaticModule serves at /uploads.
        // If file.path is "uploads/foo.txt", then we expect it at "/uploads/foo.txt" ?
        // Wait, ServeStatic serveRoot is '/uploads'. rootPath is 'uploads'.
        // So hitting http://localhost/uploads/foo.txt should map to uploads/foo.txt.

        // However, the DB url is "uploads/foo.txt". 
        // We probably want to fetch it relative to the server.

        // Let's inspect what URL we got.
        const dbUrl = attachment.url;
        // On Windows file.path might have backslashes.
        const normalizedUrl = dbUrl.replace(/\\/g, '/');
        const filename = normalizedUrl.split('/').pop();

        return request(app.getHttpServer())
            .get(`/uploads/${filename}`)
            .expect(200)
            .expect('Hello World Attachment Content');
    });

    it('/attachments/:id (DELETE) - should delete the attachment', async () => {
        const listRes = await request(app.getHttpServer())
            .get(`/cards/${cardId}/attachments`)
            .set('Authorization', `Bearer ${jwtToken}`);
        const attachmentId = listRes.body[0].id;

        return request(app.getHttpServer())
            .delete(`/attachments/${attachmentId}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(200);
    });
});

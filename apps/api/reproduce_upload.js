
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function run() {
    try {
        // Register (or login)
        const email = `test-${Date.now()}@example.com`;
        const registerRes = await axios.post('http://localhost:3001/auth/register', {
            email,
            password: 'password123',
            name: 'Test Repro'
        });
        const token = registerRes.data.accessToken;

        // Create Workspace
        const wsRes = await axios.post('http://localhost:3001/workspaces',
            { name: 'Repro WS' },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const wsId = wsRes.data.id;

        // Create Board
        const boardRes = await axios.post(`http://localhost:3001/boards`,
            { title: 'Repro Board', workspaceId: wsId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const boardId = boardRes.data.id;

        // Create List
        const listRes = await axios.post(`http://localhost:3001/lists`,
            { title: 'Repro List', boardId: boardId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const listId = listRes.data.id;

        // Create Card
        const cardRes = await axios.post(`http://localhost:3001/cards`,
            { title: 'Repro Card', listId: listId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const cardId = cardRes.data.id;

        // Upload File
        const form = new FormData();
        fs.writeFileSync('repro.txt', 'test content');
        form.append('file', fs.createReadStream('repro.txt'));

        console.log('Uploading file...');
        const uploadRes = await axios.post(`http://localhost:3001/cards/${cardId}/attachments`, form, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...form.getHeaders()
            }
        });

        console.log('Upload success:', uploadRes.data);

    } catch (e) {
        const errorLog = JSON.stringify({
            message: e.message,
            code: e.code,
            status: e.response?.status,
            data: e.response?.data,
        }, null, 2) + '\n' + e.stack;

        console.error('Error Details written to repro.log');
        fs.writeFileSync('repro.log', errorLog);
    }
}

run();

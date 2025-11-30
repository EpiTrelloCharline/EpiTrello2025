const axios = require('axios');
console.log('Script started');

const API_URL = 'http://localhost:3001';
let token = '';
let boardId = '';
let listId1 = '';
let listId2 = '';
let cardId = '';

async function run() {
    try {
        // 1. Login/Register
        console.log('Registering/Logging in...');
        try {
            await axios.post(`${API_URL}/auth/register`, { email: 'test@example.com', password: 'password' });
        } catch (e) { }
        const loginRes = await axios.post(`${API_URL}/auth/login`, { email: 'test@example.com', password: 'password' });
        console.log('Login response:', loginRes.data);
        token = loginRes.data.accessToken || loginRes.data.access_token;
        console.log('Token:', token);
        const headers = { Authorization: `Bearer ${token}` };

        // 2. Create Workspace
        console.log('Creating Workspace...');
        const wsRes = await axios.post(`${API_URL}/workspaces`, { name: 'Test WS' }, { headers });
        const wsId = wsRes.data.id;

        // 3. Create Board
        console.log('Creating Board...');
        const boardRes = await axios.post(`${API_URL}/boards`, { workspaceId: wsId, title: 'Test Board' }, { headers });
        boardId = boardRes.data.id;

        // 4. Create Lists
        console.log('Creating Lists...');
        const list1Res = await axios.post(`${API_URL}/lists`, { boardId, title: 'List 1' }, { headers });
        listId1 = list1Res.data.id;
        const list2Res = await axios.post(`${API_URL}/lists`, { boardId, title: 'List 2' }, { headers });
        listId2 = list2Res.data.id;

        // 5. Create Card
        console.log('Creating Card...');
        const cardRes = await axios.post(`${API_URL}/cards`, { listId: listId1, title: 'Card 1' }, { headers });
        cardId = cardRes.data.id;
        console.log('Card created:', cardRes.data);
        if (Number(cardRes.data.position) !== 1) throw new Error('Initial position should be 1');

        // 6. Create another card in List 1
        const card2Res = await axios.post(`${API_URL}/cards`, { listId: listId1, title: 'Card 2' }, { headers });
        console.log('Card 2 created:', card2Res.data);
        if (Number(card2Res.data.position) !== 2) throw new Error('Second card position should be 2');

        // 7. Move Card 1 to List 2
        console.log('Moving Card 1 to List 2...');
        const moveRes = await axios.post(`${API_URL}/cards/move`, { cardId, listId: listId2 }, { headers });
        console.log('Card moved:', moveRes.data);
        if (moveRes.data.listId !== listId2) throw new Error('Card should be in List 2');
        if (Number(moveRes.data.position) !== 1) throw new Error('Card in new list should be at pos 1');

        console.log('Verification SUCCESS!');
    } catch (error) {
        console.error('Verification FAILED:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

run();

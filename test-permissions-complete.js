#!/usr/bin/env node

/**
 * Script de Test Complet du Système de Permissions
 * 
 * Ce script teste tous les scénarios :
 * 1. Création de 4 utilisateurs (owner, member, observer, non-member)
 * 2. Création d'un workspace et board
 * 3. Ajout des membres au board avec les bons rôles
 * 4. Test des droits d'écriture (POST, PATCH, DELETE)
 * 5. Test des droits de lecture (GET)
 */

const API_URL = 'http://localhost:3001';

// Couleurs pour la console
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
    console.log(`\n${colors.bright}${colors.cyan}${'═'.repeat(70)}${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}  ${title}${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}${'═'.repeat(70)}${colors.reset}\n`);
}

function logTest(name) {
    console.log(`${colors.blue}▶ ${name}${colors.reset}`);
}

function logSuccess(message) {
    log(`  ✓ ${message}`, 'green');
}

function logError(message) {
    log(`  ✗ ${message}`, 'red');
}

function logInfo(message) {
    log(`  ℹ ${message}`, 'dim');
}

function logWarning(message) {
    log(`  ⚠ ${message}`, 'yellow');
}

// Fonction helper pour faire des requêtes
async function request(method, path, token = null, body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_URL}${path}`, options);
        const data = response.status !== 204 ? await response.json().catch(() => null) : null;
        return { status: response.status, data, ok: response.ok };
    } catch (error) {
        return { status: 0, data: null, ok: false, error: error.message };
    }
}

// Stats globales
const stats = {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
};

function expectStatus(actual, expected, testName) {
    stats.total++;
    if (actual === expected) {
        stats.passed++;
        logSuccess(`${testName} → Status ${actual} ✓`);
        return true;
    } else {
        stats.failed++;
        logError(`${testName} → Status ${actual} (attendu: ${expected})`);
        return false;
    }
}

async function main() {
    log('\n╔════════════════════════════════════════════════════════════════════╗', 'cyan');
    log('║         TEST COMPLET DU SYSTÈME DE PERMISSIONS DE BOARD           ║', 'cyan');
    log('╚════════════════════════════════════════════════════════════════════╝\n', 'cyan');

    // Vérifier que l'API est accessible
    logSection('0️⃣  Vérification de l\'API');
    try {
        const response = await fetch(API_URL);
        logSuccess(`API accessible sur ${API_URL}`);
    } catch (error) {
        logError(`Impossible de se connecter à l'API sur ${API_URL}`);
        logInfo('Assurez-vous que l\'API est démarrée : cd apps/api && npm run start:dev');
        process.exit(1);
    }

    // Étape 1 : Créer les utilisateurs
    logSection('1️⃣  Création des Utilisateurs de Test');

    const users = {
        owner: { email: `owner.${Date.now()}@test.com`, name: 'Owner User', password: 'test123' },
        member: { email: `member.${Date.now()}@test.com`, name: 'Member User', password: 'test123' },
        observer: { email: `observer.${Date.now()}@test.com`, name: 'Observer User', password: 'test123' },
        nonmember: { email: `nonmember.${Date.now()}@test.com`, name: 'Non Member', password: 'test123' },
    };

    const tokens = {};
    const userIds = {};

    for (const [role, userData] of Object.entries(users)) {
        logTest(`Création de l'utilisateur ${role.toUpperCase()}`);
        const { status, data } = await request('POST', '/auth/register', null, userData);

        if (status === 201 || status === 200) {
            tokens[role] = data.accessToken;
            userIds[role] = data.user.id;
            logSuccess(`${userData.email} créé avec succès`);
            logInfo(`User ID: ${userIds[role]}`);
        } else {
            logError(`Échec de création (status ${status})`);
            logInfo(`Réponse: ${JSON.stringify(data)}`);
            process.exit(1);
        }
    }

    // Étape 2 : Créer workspace et board
    logSection('2️⃣  Création du Workspace et Board');

    logTest('Création du workspace');
    const wsResult = await request('POST', '/workspaces', tokens.owner, {
        name: 'Test Workspace Permissions',
        description: 'Workspace pour tester les permissions de board',
    });

    if (!wsResult.ok) {
        logError(`Échec création workspace (status ${wsResult.status})`);
        process.exit(1);
    }

    const workspaceId = wsResult.data.id;
    logSuccess(`Workspace créé: ${workspaceId}`);

    logTest('Création du board');
    const boardResult = await request('POST', '/boards', tokens.owner, {
        workspaceId,
        title: 'Test Board Permissions',
    });

    if (!boardResult.ok) {
        logError(`Échec création board (status ${boardResult.status})`);
        process.exit(1);
    }

    const boardId = boardResult.data.id;
    logSuccess(`Board créé: ${boardId}`);

    // Étape 3 : Ajouter les membres au board via Prisma
    logSection('3️⃣  Ajout des Membres au Board');

    const { PrismaClient } = require('./apps/api/node_modules/@prisma/client');
    const prisma = new PrismaClient();

    try {
        // OWNER est déjà créé automatiquement, on vérifie
        logTest('Vérification du membre OWNER');
        const ownerMember = await prisma.boardMember.findFirst({
            where: { boardId, userId: userIds.owner },
        });

        if (ownerMember) {
            logSuccess(`OWNER déjà membre du board avec rôle: ${ownerMember.role}`);
        } else {
            logWarning('OWNER pas encore membre, ajout manuel...');
            await prisma.boardMember.create({
                data: {
                    boardId,
                    userId: userIds.owner,
                    role: 'OWNER',
                },
            });
            logSuccess('OWNER ajouté au board');
        }

        // Ajouter MEMBER
        logTest('Ajout du MEMBER au board');
        await prisma.boardMember.create({
            data: {
                boardId,
                userId: userIds.member,
                role: 'MEMBER',
            },
        });
        logSuccess('MEMBER ajouté au board');

        // Ajouter OBSERVER
        logTest('Ajout de l\'OBSERVER au board');
        await prisma.boardMember.create({
            data: {
                boardId,
                userId: userIds.observer,
                role: 'OBSERVER',
            },
        });
        logSuccess('OBSERVER ajouté au board');

        logInfo('NON-MEMBER ne sera PAS ajouté au board (pour tester le refus d\'accès)');

    } catch (error) {
        logError(`Erreur lors de l'ajout des membres: ${error.message}`);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }

    // Étape 4 : Créer une liste pour les tests
    logSection('4️⃣  Création d\'une Liste de Test');

    logTest('Création de la liste avec OWNER');
    const listResult = await request('POST', '/lists', tokens.owner, {
        boardId,
        title: 'Test List',
    });

    if (!listResult.ok) {
        logError(`Échec création liste (status ${listResult.status})`);
        process.exit(1);
    }

    const listId = listResult.data.id;
    logSuccess(`Liste créée: ${listId}`);

    // Étape 5 : Tests des droits d'ÉCRITURE
    logSection('5️⃣  Tests des Droits d\'ÉCRITURE (BoardWriteGuard)');

    // Test 5.1 : POST /cards avec OWNER
    logTest('POST /cards avec OWNER');
    const ownerCardResult = await request('POST', '/cards', tokens.owner, {
        listId,
        title: 'Card créée par OWNER',
    });
    expectStatus(ownerCardResult.status, 201, 'OWNER peut créer une carte');
    const cardId = ownerCardResult.data?.id;

    // Test 5.2 : POST /cards avec MEMBER
    logTest('POST /cards avec MEMBER');
    const memberCardResult = await request('POST', '/cards', tokens.member, {
        listId,
        title: 'Card créée par MEMBER',
    });
    expectStatus(memberCardResult.status, 201, 'MEMBER peut créer une carte');

    // Test 5.3 : POST /cards avec OBSERVER (devrait échouer)
    logTest('POST /cards avec OBSERVER');
    const observerCardResult = await request('POST', '/cards', tokens.observer, {
        listId,
        title: 'Card créée par OBSERVER',
    });
    expectStatus(observerCardResult.status, 403, 'OBSERVER ne peut PAS créer une carte');
    if (observerCardResult.status === 403) {
        logInfo(`Message d'erreur: "${observerCardResult.data?.message}"`);
    }

    // Test 5.4 : POST /cards avec NON-MEMBER (devrait échouer)
    logTest('POST /cards avec NON-MEMBER');
    const nonmemberCardResult = await request('POST', '/cards', tokens.nonmember, {
        listId,
        title: 'Card créée par NON-MEMBER',
    });
    expectStatus(nonmemberCardResult.status, 403, 'NON-MEMBER ne peut PAS créer une carte');
    if (nonmemberCardResult.status === 403) {
        logInfo(`Message d'erreur: "${nonmemberCardResult.data?.message}"`);
    }

    // Test 5.5 : PATCH /cards/:id avec OWNER
    if (cardId) {
        logTest('PATCH /cards/:id avec OWNER');
        const ownerPatchResult = await request('PATCH', `/cards/${cardId}`, tokens.owner, {
            title: 'Card modifiée par OWNER',
        });
        expectStatus(ownerPatchResult.status, 200, 'OWNER peut modifier une carte');

        // Test 5.6 : PATCH /cards/:id avec MEMBER
        logTest('PATCH /cards/:id avec MEMBER');
        const memberPatchResult = await request('PATCH', `/cards/${cardId}`, tokens.member, {
            title: 'Card modifiée par MEMBER',
        });
        expectStatus(memberPatchResult.status, 200, 'MEMBER peut modifier une carte');

        // Test 5.7 : PATCH /cards/:id avec OBSERVER (devrait échouer)
        logTest('PATCH /cards/:id avec OBSERVER');
        const observerPatchResult = await request('PATCH', `/cards/${cardId}`, tokens.observer, {
            title: 'Card modifiée par OBSERVER',
        });
        expectStatus(observerPatchResult.status, 403, 'OBSERVER ne peut PAS modifier une carte');

        // Test 5.8 : PATCH /cards/:id avec NON-MEMBER (devrait échouer)
        logTest('PATCH /cards/:id avec NON-MEMBER');
        const nonmemberPatchResult = await request('PATCH', `/cards/${cardId}`, tokens.nonmember, {
            title: 'Card modifiée par NON-MEMBER',
        });
        expectStatus(nonmemberPatchResult.status, 403, 'NON-MEMBER ne peut PAS modifier une carte');
    }

    // Test 5.9 : POST /lists avec OBSERVER (devrait échouer)
    logTest('POST /lists avec OBSERVER');
    const observerListResult = await request('POST', '/lists', tokens.observer, {
        boardId,
        title: 'Liste créée par OBSERVER',
    });
    expectStatus(observerListResult.status, 403, 'OBSERVER ne peut PAS créer une liste');

    // Test 5.10 : POST /lists avec MEMBER
    logTest('POST /lists avec MEMBER');
    const memberListResult = await request('POST', '/lists', tokens.member, {
        boardId,
        title: 'Liste créée par MEMBER',
    });
    expectStatus(memberListResult.status, 201, 'MEMBER peut créer une liste');

    // Étape 6 : Tests des droits de LECTURE
    logSection('6️⃣  Tests des Droits de LECTURE (BoardReadGuard)');

    // Test 6.1 : GET /cards avec OWNER
    logTest('GET /cards avec OWNER');
    const ownerReadCards = await request('GET', `/cards?listId=${listId}`, tokens.owner);
    expectStatus(ownerReadCards.status, 200, 'OWNER peut lire les cartes');

    // Test 6.2 : GET /cards avec MEMBER
    logTest('GET /cards avec MEMBER');
    const memberReadCards = await request('GET', `/cards?listId=${listId}`, tokens.member);
    expectStatus(memberReadCards.status, 200, 'MEMBER peut lire les cartes');

    // Test 6.3 : GET /cards avec OBSERVER
    logTest('GET /cards avec OBSERVER');
    const observerReadCards = await request('GET', `/cards?listId=${listId}`, tokens.observer);
    expectStatus(observerReadCards.status, 200, 'OBSERVER peut lire les cartes');

    // Test 6.4 : GET /cards avec NON-MEMBER (devrait échouer)
    logTest('GET /cards avec NON-MEMBER');
    const nonmemberReadCards = await request('GET', `/cards?listId=${listId}`, tokens.nonmember);
    expectStatus(nonmemberReadCards.status, 403, 'NON-MEMBER ne peut PAS lire les cartes');

    // Test 6.5 : GET /lists avec OBSERVER
    logTest('GET /lists avec OBSERVER');
    const observerReadLists = await request('GET', `/lists?boardId=${boardId}`, tokens.observer);
    expectStatus(observerReadLists.status, 200, 'OBSERVER peut lire les listes');

    // Test 6.6 : GET /lists avec NON-MEMBER (devrait échouer)
    logTest('GET /lists avec NON-MEMBER');
    const nonmemberReadLists = await request('GET', `/lists?boardId=${boardId}`, tokens.nonmember);
    expectStatus(nonmemberReadLists.status, 403, 'NON-MEMBER ne peut PAS lire les listes');

    // Test 6.7 : GET /boards/:id avec OBSERVER
    logTest('GET /boards/:id avec OBSERVER');
    const observerReadBoard = await request('GET', `/boards/${boardId}`, tokens.observer);
    expectStatus(observerReadBoard.status, 200, 'OBSERVER peut lire le board');

    // Test 6.8 : GET /boards/:id avec NON-MEMBER (devrait échouer)
    logTest('GET /boards/:id avec NON-MEMBER');
    const nonmemberReadBoard = await request('GET', `/boards/${boardId}`, tokens.nonmember);
    expectStatus(nonmemberReadBoard.status, 403, 'NON-MEMBER ne peut PAS lire le board');

    // Étape 7 : Test DELETE
    logSection('7️⃣  Tests de SUPPRESSION (DELETE)');

    // Créer une carte à supprimer
    const cardToDelete = await request('POST', '/cards', tokens.owner, {
        listId,
        title: 'Card à supprimer',
    });
    const deleteCardId = cardToDelete.data?.id;

    if (deleteCardId) {
        // Test 7.1 : DELETE avec OBSERVER (devrait échouer)
        logTest('DELETE /cards/:id avec OBSERVER');
        const observerDelete = await request('DELETE', `/cards/${deleteCardId}`, tokens.observer);
        expectStatus(observerDelete.status, 403, 'OBSERVER ne peut PAS supprimer une carte');

        // Test 7.2 : DELETE avec MEMBER
        logTest('DELETE /cards/:id avec MEMBER');
        const memberDelete = await request('DELETE', `/cards/${deleteCardId}`, tokens.member);
        expectStatus(memberDelete.status, 200, 'MEMBER peut supprimer une carte');
    }

    // Résumé final
    logSection('📊 RÉSUMÉ DES TESTS');

    const successRate = ((stats.passed / stats.total) * 100).toFixed(1);

    log(`Total de tests     : ${stats.total}`, 'bright');
    log(`Tests réussis      : ${stats.passed}`, stats.passed === stats.total ? 'green' : 'yellow');
    log(`Tests échoués      : ${stats.failed}`, stats.failed === 0 ? 'green' : 'red');
    log(`Taux de réussite   : ${successRate}%`, successRate === '100.0' ? 'green' : 'yellow');

    console.log('');

    if (stats.failed === 0) {
        log('╔════════════════════════════════════════════════════════════════════╗', 'green');
        log('║  ✓ TOUS LES TESTS SONT PASSÉS !                                   ║', 'green');
        log('║  Le système de permissions fonctionne parfaitement.               ║', 'green');
        log('╚════════════════════════════════════════════════════════════════════╝', 'green');
    } else {
        log('╔════════════════════════════════════════════════════════════════════╗', 'red');
        log('║  ✗ CERTAINS TESTS ONT ÉCHOUÉ                                      ║', 'red');
        log('║  Vérifiez les logs ci-dessus pour plus de détails.               ║', 'red');
        log('╚════════════════════════════════════════════════════════════════════╝', 'red');
        process.exit(1);
    }

    console.log('');
    logInfo('Données de test créées :');
    logInfo(`  Workspace ID : ${workspaceId}`);
    logInfo(`  Board ID     : ${boardId}`);
    logInfo(`  List ID      : ${listId}`);
    logInfo('');
    logInfo('Tokens JWT (valables 7 jours) :');
    for (const [role, token] of Object.entries(tokens)) {
        logInfo(`  ${role.toUpperCase().padEnd(10)} : ${token.substring(0, 50)}...`);
    }
    console.log('');
}

// Exécuter les tests
main().catch(error => {
    console.error('\n❌ Erreur fatale:', error);
    process.exit(1);
});

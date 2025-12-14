import { Page } from '@playwright/test';

const API_BASE_URL = 'http://localhost:3001';

/**
 * Interface pour les données d'utilisateur
 */
export interface UserCredentials {
    email: string;
    password: string;
    name?: string;
}

/**
 * Interface pour la réponse d'authentification
 */
export interface AuthResponse {
    accessToken: string;
    user: {
        id: string;
        email: string;
        name?: string;
    };
}

/**
 * Génère un email unique pour les tests
 */
export function generateUniqueEmail(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `test-${timestamp}-${random}@epitrello.com`;
}

/**
 * Crée un nouvel utilisateur via l'API
 */
export async function registerUser(credentials?: Partial<UserCredentials>): Promise<UserCredentials> {
    const user: UserCredentials = {
        email: credentials?.email || generateUniqueEmail(),
        password: credentials?.password || 'Test123456!',
        name: credentials?.name || 'Test User',
    };

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to register user: ${response.status} - ${error}`);
    }

    return user;
}

/**
 * Se connecte avec les credentials et retourne le token
 */
export async function loginUser(credentials: UserCredentials): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to login: ${response.status} - ${error}`);
    }

    const data: AuthResponse = await response.json();
    return data.accessToken;
}

/**
 * Configure une page Playwright avec l'authentification
 * Enregistre le token dans le localStorage
 */
export async function setupAuthenticatedPage(page: Page, token: string): Promise<void> {
    // Naviguer vers l'app pour initialiser le localStorage
    await page.goto('/');

    // Injecter le token dans le localStorage
    await page.evaluate((accessToken) => {
        localStorage.setItem('accessToken', accessToken);
    }, token);
}

/**
 * Crée un utilisateur, se connecte et configure la page avec l'authentification
 * Fonction tout-en-un pour simplifier les tests
 */
export async function setupAuthenticatedUser(page: Page): Promise<UserCredentials> {
    // Créer un nouvel utilisateur
    const user = await registerUser();

    // Se connecter et obtenir le token
    const token = await loginUser(user);

    // Configurer la page avec le token
    await setupAuthenticatedPage(page, token);

    return user;
}

/**
 * Se connecte via l'UI (pour tester le flow complet)
 */
export async function loginViaUI(page: Page, credentials: UserCredentials): Promise<void> {
    await page.goto('/login');

    // Remplir le formulaire
    await page.fill('input[type="email"]', credentials.email);
    await page.fill('input[type="password"]', credentials.password);

    // Soumettre
    await page.click('button[type="submit"]');

    // Attendre la redirection
    await page.waitForURL('/workspaces');
}

/**
 * Crée un utilisateur et se connecte via l'UI
 */
export async function registerAndLoginViaUI(page: Page): Promise<UserCredentials> {
    const user = await registerUser();
    await loginViaUI(page, user);
    return user;
}

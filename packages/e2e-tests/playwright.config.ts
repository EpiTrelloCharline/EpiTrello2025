import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour les tests E2E EpiTrello
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './tests',

    // Timeout pour chaque test
    timeout: 30 * 1000,

    // Nombre de tentatives en cas d'échec
    retries: 1,

    // Nombre de workers (parallélisation)
    workers: 1,

    // Reporter pour générer les rapports
    reporter: [
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['list'],
        ['json', { outputFile: 'test-results.json' }]
    ],

    // Options partagées pour tous les tests
    use: {
        // URL de base de l'application
        baseURL: 'http://localhost:3000',

        // Trace en cas d'échec
        trace: 'on-first-retry',

        // Screenshots
        screenshot: 'only-on-failure',

        // Vidéos
        video: 'retain-on-failure',

        // Timeouts pour les actions
        actionTimeout: 10 * 1000,
        navigationTimeout: 10 * 1000,
    },

    // Configuration des projets (navigateurs)
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        // Décommenter pour tester sur d'autres navigateurs
        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },
        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },
    ],

    // Serveur local (optionnel - nous supposons que l'app tourne déjà)
    // webServer: {
    //   command: 'pnpm dev',
    //   url: 'http://localhost:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
});

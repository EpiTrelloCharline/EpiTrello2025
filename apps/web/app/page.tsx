import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Epi Trello</h1>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="text-blue-500 hover:text-blue-600 px-4 py-2"
              >
                Connexion
              </Link>
              <Link
                href="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Workspaces
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Bienvenue sur Epi Trello</h2>
          <p className="text-gray-600 mb-8">
            Gérez vos espaces de travail et collaborez avec votre équipe
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
            >
              Se connecter
            </Link>
            <Link
              href="/workspaces"
              className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg text-lg"
            >
              Accéder aux Workspaces
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}


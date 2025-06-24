export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-800 flex flex-col justify-center items-center px-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-bold mb-4">
          MyNegosyo <span className="text-blue-600">POS</span>
        </h1>
        <p className="text-lg mb-6 text-gray-600">
          A simple, offline-first Point of Sale system built for small businesses in the Philippines.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow transition"
          >
            Get Started
          </a>
          <a
            href="/signin"
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded transition"
          >
            Log In
          </a>
        </div>

        <p className="mt-8 text-sm text-gray-400">
          Made for sari-sari stores, mini groceries, and local shops.
        </p>
      </div>
    </main>
  );
}

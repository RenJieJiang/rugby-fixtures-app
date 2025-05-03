import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-grow h-full justify-center items-center bg-gray-50 text-blue-900 p-6">
      <section
        aria-labelledby="welcome-heading"
        className="max-w-5xl w-full text-center -mt-40"
      >
        <h1 id="welcome-heading" className="text-3xl font-bold mb-6">
          Welcome to Rugby Fixtures
        </h1>
        <p className="text-lg mb-8">Browse and search rugby fixtures data</p>
        <nav aria-label="Quick actions" className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/upload"
            className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Upload Fixtures Data
          </Link>
          <Link
            href="/fixtures"
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
          >
            Browse Fixtures
          </Link>
        </nav>
      </section>
    </div>
  );
}

import Link from 'next/link';
import { FixtureSchema } from '../lib/models/fixture';
import UploadForm from '../ui/upload/upload-form';

export default function UploadPage() {
  const fixtureKeysString = Object.keys(FixtureSchema.shape).join(', ');

  return (
    <main className="flex flex-col flex-grow h-full items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-xl">
        <header className="flex justify-center">
          <h1 className="text-3xl font-bold mb-6 text-blue-900">Upload Rugby Fixtures</h1>
        </header>
        
        <section aria-labelledby="upload-form">
          <h2 id="upload-form" className="sr-only">Upload Form</h2>
          <UploadForm />
        </section>
        
        <aside className="mt-8 p-4 bg-blue-50 rounded-lg" aria-labelledby="instructions-heading">
          <h2 id="instructions-heading" className="font-medium text-blue-900">Instructions:</h2>
          <p className="mt-1 text-sm text-blue-800">
            Upload a CSV file containing rugby fixture data. Required columns: 
            <span className="block font-bold">
              {fixtureKeysString}
            </span>
          </p>
          <nav className="mt-3" aria-label="Resources">
            <Link 
              href="/sample-fixtures.csv" 
              className="text-sm text-blue-600 font-medium hover:text-blue-800"
              download
            >
              Download Sample CSV Template
            </Link>
          </nav>
        </aside>
      </div>
    </main>
  );
}
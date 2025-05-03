'use client'

import { useState, useRef } from 'react';
import { uploadCSV } from '../../lib/actions/upload';

export default function UploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success?: boolean; message?: string; count?: number } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  async function handleSubmit(formData: FormData) {
    setIsUploading(true);
    setUploadResult(null);
    
    try {
      const result = await uploadCSV(formData);
      setUploadResult(result);
      
      if (result.success && formRef.current) {
        formRef.current.reset(); // Reset form if successful
      }
    } catch (error) {
      setUploadResult({ 
        success: false, 
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="w-full max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <header>
        <h2 className="text-xl font-bold mb-6 text-blue-900">Upload Rugby Fixtures CSV</h2>
      </header>
      
      <form ref={formRef} action={handleSubmit} className="space-y-6" aria-label="Upload CSV form">
        <fieldset>
          <legend className="sr-only">File upload fields</legend>
          <div className="mb-4">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Select CSV File
            </label>
            <input
              id="file"
              name="file"
              type="file"
              accept=".csv"
              required
              aria-required="true"
              className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
            />
            {/* <p className="mt-1 text-sm text-gray-400">
              Upload a CSV file containing rugby fixture data
            </p> */}
          </div>
        
          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            aria-busy={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload CSV'}
          </button>
        </fieldset>
      </form>

      {uploadResult && (
        <aside className={`mt-6 p-4 rounded-md ${uploadResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} 
               role="status" 
               aria-live="polite">
          <p className="text-sm font-medium">{uploadResult.message}</p>
          {uploadResult.success && uploadResult.count && (
            <p className="text-sm mt-1">Successfully processed {uploadResult.count} fixtures.</p>
          )}
        </aside>
      )}
    </section>
  );
}
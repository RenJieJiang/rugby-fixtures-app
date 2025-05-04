'use client'

import { useState, useRef } from 'react';
import { uploadCSV } from '../../lib/actions/upload';
import { CSVFixture } from '../../lib/models/fixture';
import { ValidationErrorFormat } from '../../lib/actions/upload';

// Import the ValidationErrorFormat type or define it if not exported
type InvalidRecord = {
  rowNumber: number;
  data: CSVFixture;
  errors: ValidationErrorFormat;
};

type UploadResult = {
  success?: boolean;
  message?: string;
  count?: number;
  duplicates?: number;
  invalidCount?: number;
  invalidRecords?: InvalidRecord[];
};

export default function UploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  async function handleSubmit(formData: FormData) {
    setIsUploading(true);
    setUploadResult(null);
    setShowDetails(false);
    
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

  function toggleDetails() {
    setShowDetails(prev => !prev);
  }

  // Format error details for display
  function formatErrorDetails(errors: ValidationErrorFormat): string {
    if (errors._errors) {
      return errors._errors.join(', ');
    }
    
    return Object.entries(errors)
      .filter(([key]) => key !== '_errors')
      .map(([key, errorValue]) => {
        // Improved type checking to correctly narrow the type
        if (typeof errorValue === 'object' && 
            errorValue !== null && 
            '_errors' in errorValue && 
            Array.isArray(errorValue._errors)) {
          return `${key}: ${errorValue._errors.join(', ')}`;
        }
        return `${key}: Invalid value`;
      })
      .join('; ');
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
            <p className="mt-1 text-sm text-gray-400">
              
            </p>
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
        <aside 
          className={`mt-6 p-4 rounded-md ${uploadResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} 
          role="status" 
          aria-live="polite"
        >
          <p className="text-sm font-medium">{uploadResult.message}</p>
          
          {uploadResult.success ? (
            <div className="mt-2 text-sm">
              <p>Successfully inserted {uploadResult.count} fixtures.</p>
              {(uploadResult.duplicates && uploadResult.duplicates > 0) && (
                <p>{uploadResult.duplicates} duplicates were skipped.</p>
              )}
              {(uploadResult.invalidCount && uploadResult.invalidCount > 0) && (
                <p className="text-amber-600">{uploadResult.invalidCount} records had validation errors.</p>
              )}
            </div>
          ) : null}
          
          {/* Show invalid records if available - regardless of success state */}
          {uploadResult.invalidRecords && uploadResult.invalidRecords.length > 0 && (
            <div className="mt-3">
              <button 
                onClick={toggleDetails}
                className={`text-sm font-medium underline focus:outline-none ${!uploadResult.success ? 'text-red-800' : 'text-amber-600'}`}
                aria-expanded={showDetails}
                aria-controls="error-details"
              >
                {showDetails ? 'Hide error details' : 'Show error details'}
              </button>
              
              {showDetails && (
                <div id="error-details" className="mt-2 text-sm bg-white bg-opacity-50 p-3 rounded max-h-60 overflow-auto">
                  <h3 className="font-medium mb-2">Invalid records:</h3>
                  <ul className="space-y-3">
                    {uploadResult.invalidRecords.map((record, index) => (
                      <li key={index} className="border-b border-red-200 pb-2">
                        <div><strong>Row {record.rowNumber}:</strong></div>
                        <div className="text-xs">
                          <pre className="whitespace-pre-wrap break-all">
                            Data: {JSON.stringify(record.data, null, 2)}
                          </pre>
                          <pre className="whitespace-pre-wrap mt-1 text-red-600">
                            Errors: {formatErrorDetails(record.errors)}
                          </pre>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {uploadResult.invalidCount && uploadResult.invalidCount > uploadResult.invalidRecords.length && (
                    <p className="mt-2 italic">Showing {uploadResult.invalidRecords.length} of {uploadResult.invalidCount} invalid records</p>
                  )}
                </div>
              )}
            </div>
          )}
        </aside>
      )}
    </section>
  );
}
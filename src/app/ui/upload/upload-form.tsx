'use client'

import { useRef, useState, useEffect } from 'react';
import { useActionState } from 'react';
import { uploadCSV } from '../../lib/actions/upload';
import { CSVFixture } from '../../lib/models/fixture';
import { ValidationErrorFormat } from '../../lib/actions/upload';

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

type UploadState = {
  result: UploadResult | null;
};

const initialState: UploadState = {
  result: null
};

export default function UploadForm() {
  const [state, formAction, isPending] = useActionState(handleUpload, initialState);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showResults, setShowResults] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  
  // Clear file input when upload is successful
  useEffect(() => {
    if (state.result?.success && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [state.result]);
  
  const handleSubmit = () => {
      setShowResults(true);
      setShowDetails(false);
  };

  async function handleUpload(prevState: UploadState, formData: FormData) {
    try {
      const result = await uploadCSV(formData);
      return { 
        result
      };
    } catch (error) {
      return { 
        result: { 
          success: false, 
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      };
    }
  }

  function handleToggleDetails() {
    setShowDetails(!showDetails);
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

  const { result } = state;

  return (
    <section className="w-full max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <header>
        <h2 className="text-xl font-bold mb-6 text-blue-900">Upload Rugby Fixtures CSV</h2>
      </header>
      
      <form action={formAction} onSubmit={handleSubmit} className="space-y-6" aria-label="Upload CSV form">
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
              ref={fileInputRef}
              onChange={() => {
                setShowResults(false);
              }}
              className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-100 file:text-blue-700
                        hover:file:bg-blue-200 file:cursor-pointer
                        file:transition-colors file:duration-200"
            />
          </div>
        
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors duration-200"
            aria-busy={isPending}
          >
            {isPending ? 'Uploading...' : 'Upload CSV'}
          </button>
        </fieldset>
      </form>

      {/* loading indicator for better visibility */}
      {isPending && (
        <div className="mt-4 flex justify-center">
          <div className="text-center text-blue-600">
            <div className="inline-block animate-pulse">Processing your file...</div>
          </div>
        </div>
      )}

      {result && showResults && (
        <aside 
          className={`mt-6 p-4 rounded-md ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} 
          role="status" 
          aria-live="polite"
        >
          <p className="text-sm font-medium">{result.message}</p>
          
          {result.success ? (
            <div className="mt-2 text-sm">
              <p>Successfully inserted {result.count} fixtures.</p>
              {(result.duplicates ?? 0) > 0 && (
                <p>{result.duplicates} duplicates were skipped.</p>
              )}
              {(result.invalidCount ?? 0) > 0 && (
                <p className="text-amber-600">{result.invalidCount} records had validation errors.</p>
              )}
            </div>
          ) : null}
          
          {/* Show invalid records if available - regardless of success state */}
          {!!result.invalidRecords && result.invalidRecords.length > 0 && (
            <div className="mt-3">
              <button 
                onClick={handleToggleDetails}
                className={`text-sm font-medium underline focus:outline-none ${!result.success ? 'text-red-800' : 'text-amber-600'} hover:cursor-pointer`}
                aria-expanded={showDetails}
                aria-controls="error-details"
                type="button"
              >
                {showDetails ? 'Hide error details' : 'Show error details'}
              </button>
              
              {showDetails && (
                <div id="error-details" className="mt-2 text-sm bg-white bg-opacity-50 p-3 rounded max-h-60 overflow-auto">
                  <h3 className="font-medium mb-2">Invalid records:</h3>
                  <ul className="space-y-3">
                    {result.invalidRecords.map((record, index) => (
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
                  {!!result.invalidCount && result.invalidCount > (result.invalidRecords?.length || 0) && (
                    <p className="mt-2 italic">Showing {result.invalidRecords?.length} of {result.invalidCount} invalid records</p>
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
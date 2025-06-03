
import React, { useState } from 'react';
import { ClipboardDocumentCheckIcon, ClipboardIcon } from './Icons'; // Assuming these are available

interface GeneratedPromptDisplayProps {
  promptText: string;
  isLoading: boolean;
}

export const GeneratedPromptDisplay: React.FC<GeneratedPromptDisplayProps> = ({ promptText, isLoading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!promptText) return;
    navigator.clipboard.writeText(promptText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch(err => console.error('Failed to copy: ', err));
  };

  if (isLoading) {
    return (
      <div className="mt-8 p-6 bg-slate-50 rounded-lg shadow animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 rounded w-full"></div>
          <div className="h-3 bg-slate-200 rounded w-5/6"></div>
          <div className="h-3 bg-slate-200 rounded w-full"></div>
          <div className="h-3 bg-slate-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!promptText) {
    return null; // Don't render anything if there's no prompt and not loading
  }

  return (
    <div className="mt-8 p-6 bg-sky-50 border border-sky-200 rounded-lg shadow-md relative">
      <h3 className="text-xl font-semibold text-sky-800 mb-3">Generated Prompt:</h3>
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 p-2 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-md transition-colors text-sm"
        aria-label="Copy prompt to clipboard"
      >
        {copied ? (
          <>
            <ClipboardDocumentCheckIcon className="w-5 h-5 inline mr-1" /> Copied!
          </>
        ) : (
          <>
            <ClipboardIcon className="w-5 h-5 inline mr-1" /> Copy
          </>
        )}
      </button>
      <div className="whitespace-pre-wrap bg-white p-4 rounded-md text-slate-700 text-sm leading-relaxed border border-slate-200 max-h-96 overflow-y-auto">
        {promptText}
      </div>
    </div>
  );
};
    
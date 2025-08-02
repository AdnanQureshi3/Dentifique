import { Dialog, DialogContent, DialogClose } from '@radix-ui/react-dialog';
import React, { useState, useCallback } from 'react';
import { Copy } from 'lucide-react';
function CopyBox({ url, open, setOpen }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [url]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-5 shadow-xl z-[2000] focus:outline-none"
      >
        <div className="space-y-4">
          <DialogClose 
            className="absolute top-3 right-3 rounded-full bg-gray-100 p-1 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </DialogClose>
          
          <div className="flex items-center gap-2">
            <div 
              className="flex-1 truncate rounded-md bg-gray-100 px-4 py-2.5 font-mono text-sm text-gray-800"
              aria-label="URL to copy"
            >
              {url}
            </div>
            
            <button
              onClick={copyToClipboard}
              className={`p-2 py-2.5 rounded font-medium transition-colors whitespace-nowrap ${
                copied 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              aria-live="polite"
            >
              <Copy />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CopyBox;
import { useState, useRef } from 'react';
import { Upload, X, FileSpreadsheet } from 'lucide-react';
import { clsx } from 'clsx';

export default function FileUpload({ onFileSelect, accept = '.csv', file, onClear }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFileSelect(dropped);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  return (
    <div>
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={clsx(
            'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200',
            dragOver
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-black/10 dark:border-white/10 hover:border-primary/50 hover:bg-primary/3'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files[0];
              if (f) onFileSelect(f);
            }}
          />
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-7 h-7 text-primary" />
          </div>
          <p className="text-sm font-semibold text-dark dark:text-surface-light mb-1">
            Drop your CSV file here
          </p>
          <p className="text-xs text-dark/40 dark:text-surface-light/40">
            or click to browse • CSV files only
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-success/5 border border-success/20 animate-scale-in">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
            <FileSpreadsheet className="w-5 h-5 text-success" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-dark dark:text-surface-light truncate">
              {file.name}
            </p>
            <p className="text-xs text-dark/40 dark:text-surface-light/40">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          {onClear && (
            <button
              onClick={onClear}
              className="p-1.5 rounded-lg hover:bg-danger/10 transition-colors"
            >
              <X className="w-4 h-4 text-danger" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

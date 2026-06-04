import { useRef, useState, DragEvent } from 'react';
import { Upload, X, FileText, Image, CheckCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FileUploadProps {
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  hint?: string;
  onFileSelect: (file: File, base64: string) => void;
  currentFile?: string; // base64 or URL
  currentFileName?: string;
  onClear?: () => void;
  type?: 'image' | 'document' | 'any';
  className?: string;
  disabled?: boolean;
}

export default function FileUpload({
  accept,
  maxSizeMB = 5,
  label = 'Upload File',
  hint,
  onFileSelect,
  currentFile,
  currentFileName,
  onClear,
  type = 'any',
  className,
  disabled = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const defaultAccept = type === 'image'
    ? 'image/jpeg,image/png,image/webp,image/gif'
    : type === 'document'
    ? '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    : '*/*';

  const processFile = async (file: File) => {
    setError(null);
    setIsLoading(true);

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File must be smaller than ${maxSizeMB}MB`);
      setIsLoading(false);
      return;
    }

    // Validate type
    if (type === 'image') {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPG, PNG, WebP, and GIF files are allowed');
        setIsLoading(false);
        return;
      }
    }

    if (type === 'document') {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!allowedTypes.includes(file.type)) {
        setError('Only PDF and Word documents are allowed');
        setIsLoading(false);
        return;
      }
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        onFileSelect(file, reader.result as string);
        setIsLoading(false);
      };
      reader.onerror = () => {
        setError('Failed to read file');
        setIsLoading(false);
      };
    } catch {
      setError('Failed to process file');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  if (currentFile) {
    return (
      <div className={cn('relative rounded-xl border-2 border-[#E5E7EB] overflow-hidden', className)}>
        {type === 'image' ? (
          <div className="relative group">
            <img
              src={currentFile}
              alt="Uploaded file"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                onClick={() => inputRef.current?.click()}
                className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Change
              </button>
              {onClear && (
                <button
                  onClick={onClear}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
              <FileText size={20} className="text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentFileName || 'Document uploaded'}
              </p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                <CheckCircle size={12} /> File ready
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => inputRef.current?.click()}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Change
              </button>
              {onClear && (
                <button onClick={onClear} className="text-red-500 hover:text-red-600">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept || defaultAccept}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'drop-zone flex flex-col items-center justify-center p-8 text-center cursor-pointer rounded-xl',
          isDragging && 'active',
          disabled && 'opacity-50 cursor-not-allowed',
          isLoading && 'pointer-events-none'
        )}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#C1121F] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Processing file...</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
              {type === 'image' ? (
                <Image size={24} className="text-[#C1121F]" />
              ) : (
                <Upload size={24} className="text-[#C1121F]" />
              )}
            </div>
            <p className="text-sm font-semibold text-gray-900">{label}</p>
            <p className="text-xs text-gray-500 mt-1">
              {hint || `Drag & drop or click to browse • Max ${maxSizeMB}MB`}
            </p>
            {type === 'image' && (
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP, GIF supported</p>
            )}
            {type === 'document' && (
              <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX supported</p>
            )}
          </>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <XCircle size={12} /> {error}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept || defaultAccept}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}
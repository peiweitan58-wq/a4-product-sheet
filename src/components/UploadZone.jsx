import { useRef, useState } from 'react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function isValidFile(file) {
  return ACCEPTED_TYPES.includes(file.type);
}

export default function UploadZone({ onFilesAdded, disabled }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []).filter(isValidFile);
    if (files.length > 0) {
      onFilesAdded(files);
    }
  };

  return (
    <div
      className={`rounded-3xl border-2 border-dashed px-6 py-8 transition ${
        isDragging
          ? 'border-accent bg-orange-50'
          : 'border-line bg-white/80 hover:border-slate-400'
      } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) {
          setIsDragging(true);
        }
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        if (!disabled) {
          handleFiles(event.dataTransfer.files);
        }
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        multiple
        disabled={disabled}
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = '';
        }}
      />

      <div className="flex flex-col items-center gap-3 text-center">
        <div className="rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
          Upload Images
        </div>
        <h2 className="text-lg font-semibold text-ink">
          Drag and drop JPG, PNG, or WEBP files
        </h2>
        <p className="max-w-xl text-sm leading-6 text-steel">
          Add up to 6 product images. The layout updates automatically for 1, 2, 3-4,
          or 5-6 images and keeps everything aligned inside the A4 preview.
        </p>
      </div>
    </div>
  );
}

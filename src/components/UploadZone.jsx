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
          ? 'border-slate-700 bg-slate-100'
          : 'border-line bg-white hover:border-slate-400'
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
        <div className="rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
          Upload Images
        </div>
        <h2 className="text-lg font-semibold text-ink">
          Upload document or photo evidence
        </h2>
        <p className="max-w-xl text-sm leading-6 text-steel">
          Add JPG, PNG, or WEBP files. Up to 4 images are supported and the preview will
          fit them into a single A4 portrait page.
        </p>
      </div>
    </div>
  );
}

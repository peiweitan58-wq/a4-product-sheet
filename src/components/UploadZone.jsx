import { useState } from 'react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function isValidFile(file) {
  return ACCEPTED_TYPES.includes(file.type);
}

export default function UploadZone({ onFilesAdded, disabled, imageCount }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []).filter(isValidFile);
    if (files.length > 0) {
      onFilesAdded(files, 'drop');
    }
  };

  return (
    <div
      className={`rounded-3xl border-2 border-dashed px-6 py-8 transition ${
        isDragging
          ? 'border-slate-700 bg-slate-100'
          : 'border-line bg-white hover:border-slate-400'
      } ${disabled ? 'opacity-70' : ''}`}
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
        handleFiles(event.dataTransfer.files);
      }}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
          Paste Images (Ctrl + V)
        </div>
        <h2 className="text-lg font-semibold text-ink">
          Copy screenshots from WhatsApp and press Ctrl + V here.
        </h2>
        <p className="max-w-xl text-sm leading-6 text-steel">
          You can also drag and drop PNG, JPG, JPEG, or WEBP images here.
        </p>
        <p className="text-sm font-semibold text-slate-700">{`Images: ${imageCount} / 4`}</p>
      </div>
    </div>
  );
}

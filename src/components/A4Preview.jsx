import { forwardRef } from 'react';
import { A4_HEIGHT_PX, A4_WIDTH_PX } from '../utils';

function FieldBox({ label, value, className = '' }) {
  return (
    <div
      className={`rounded-[6px] border border-[#d6d6d6] bg-white px-3 py-2 ${className}`}
    >
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
        {label}
      </div>
      <div className="mt-1.5 min-h-[22px] break-words text-[15px] font-medium leading-5 text-black">
        {value || '\u00A0'}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center rounded-[8px] border border-dashed border-[#d6d6d6] bg-white px-8">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Evidence Images
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Upload up to 4 document photos. The preview, PDF, and printed page will match
          this layout exactly.
        </p>
      </div>
    </div>
  );
}

function ImageLayout({ images }) {
  if (images.length === 1) {
    return (
      <div className="grid h-full grid-cols-1">
        <ImageCard image={images[0]} />
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="grid h-full grid-cols-2 gap-3">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className="grid h-full grid-cols-3 gap-3">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-4 gap-3">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
}

function ImageCard({ image }) {
  return (
    <div className="flex min-h-0 items-center justify-center overflow-hidden rounded-[8px] border border-[#d6d6d6] bg-white p-2.5">
      <img src={image.url} alt={image.name} className="h-full w-full object-contain" />
    </div>
  );
}

const A4Preview = forwardRef(function A4Preview({ form, images }, ref) {
  return (
    <div className="print-sheet-shell mx-auto overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-sheet">
      <div
        ref={ref}
        className="flex flex-col bg-white text-black"
        style={{ width: `${A4_WIDTH_PX}px`, height: `${A4_HEIGHT_PX}px` }}
      >
        <div className="px-8 pb-3 pt-5">
          <div className="text-center">
            <h1 className="text-[22px] font-semibold uppercase tracking-[0.14em] text-slate-900">
              SALES RETURN RECORD
            </h1>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <FieldBox label="Sales Return No." value={form.salesReturnNo} />
            <FieldBox label="Date" value={form.date} />
            <FieldBox label="Customer Name" value={form.customerName} />
            <FieldBox label="Customer Phone Number" value={form.customerPhone} />
          </div>
        </div>

        <div className="flex-1 px-8 pb-3">
          <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
            <span>Evidence Images</span>
            <span>{`Images: ${images.length} / 4`}</span>
          </div>

          <div className="h-[736px]">
            {images.length > 0 ? <ImageLayout images={images} /> : <EmptyState />}
          </div>
        </div>

        <div className="px-8 pb-6 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <FieldBox label="Return Amount" value={form.returnAmount} />
            <FieldBox label="Postage" value={form.postage} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default A4Preview;

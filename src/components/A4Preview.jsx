import { forwardRef } from 'react';
import { A4_HEIGHT_PX, A4_WIDTH_PX, getGridConfig, getGridRows } from '../utils';

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-line bg-slate-50">
      <div className="max-w-sm text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
          Live Preview
        </p>
        <p className="mt-3 text-base text-steel">
          Upload product images to generate the A4 sheet layout. Title and remarks will
          appear here exactly as exported.
        </p>
      </div>
    </div>
  );
}

const A4Preview = forwardRef(function A4Preview({ title, remarks, images }, ref) {
  const gridCols = getGridConfig(images.length);
  const gridRows = getGridRows(images.length);
  const hasImages = images.length > 0;

  return (
    <div className="print-sheet-shell mx-auto overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sheet">
      <div
        ref={ref}
        className="flex flex-col bg-white text-slate-900"
        style={{ width: `${A4_WIDTH_PX}px`, height: `${A4_HEIGHT_PX}px` }}
      >
        <div className="border-b border-slate-200 px-12 pb-6 pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
            Automotive Product Sheet
          </p>
          <h1 className="mt-4 break-words text-[34px] font-bold leading-tight text-ink">
            {title || 'Enter Product Title'}
          </h1>
        </div>

        <div className="flex-1 px-10 py-8">
          {hasImages ? (
            <div className={`grid h-full gap-5 ${gridCols} ${gridRows}`}>
              {images.map((image) => (
                <div
                  key={image.id}
                  className="flex min-h-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        <div className="border-t border-slate-200 bg-slate-50/65 px-12 py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Remarks
          </p>
          <div className="mt-3 min-h-[110px] whitespace-pre-wrap break-words text-[15px] leading-7 text-steel">
            {remarks || 'Enter Remarks'}
          </div>
        </div>
      </div>
    </div>
  );
});

export default A4Preview;

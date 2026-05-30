import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import A4Preview from './components/A4Preview';
import UploadZone from './components/UploadZone';
import { A4_HEIGHT_PX, A4_WIDTH_PX, MAX_IMAGES, formatExportDate, sanitizeFileSegment } from './utils';

function createImageItems(files, currentCount) {
  const slotsLeft = Math.max(MAX_IMAGES - currentCount, 0);

  return files.slice(0, slotsLeft).map((file) => ({
    id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
    name: file.name,
    url: URL.createObjectURL(file),
  }));
}

export default function App() {
  const previewRef = useRef(null);
  const imagesRef = useRef([]);
  const [title, setTitle] = useState('');
  const [remarks, setRemarks] = useState('');
  const [images, setImages] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, []);

  const addFiles = (files) => {
    setImages((currentImages) => {
      const nextItems = createImageItems(files, currentImages.length);
      return [...currentImages, ...nextItems];
    });
  };

  const clearAll = () => {
    setImages((currentImages) => {
      currentImages.forEach((image) => URL.revokeObjectURL(image.url));
      return [];
    });
    setTitle('');
    setRemarks('');
  };

  const exportCanvas = async () => {
    if (!previewRef.current) {
      return null;
    }

    return html2canvas(previewRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: A4_WIDTH_PX,
      height: A4_HEIGHT_PX,
    });
  };

  const getFileName = () =>
    `${sanitizeFileSegment(title || 'Product_Sheet')}_${formatExportDate()}.pdf`;

  const downloadPdf = async () => {
    try {
      setIsExporting(true);
      const canvas = await exportCanvas();
      if (!canvas) {
        return;
      }

      const imageData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [A4_WIDTH_PX, A4_HEIGHT_PX],
        compress: true,
      });

      pdf.addImage(imageData, 'PNG', 0, 0, A4_WIDTH_PX, A4_HEIGHT_PX, undefined, 'FAST');
      pdf.save(getFileName());
    } finally {
      setIsExporting(false);
    }
  };

  const printPreview = () => {
    window.print();
  };

  return (
    <div className="print-layout min-h-screen px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="print-hidden rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
                A4 Product Sheet Generator
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Build polished automotive product sheets in one page
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-steel">
                Enter a title, add up to 6 product images, and write remarks. The live
                A4 preview drives both PDF export and print output for consistent results.
              </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="space-y-6">
                <label className="block">
                  <span className="mb-3 block text-sm font-semibold text-ink">Product Title</span>
                  <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Enter Product Title"
                    className="w-full rounded-2xl border border-line bg-white px-5 py-4 text-lg text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-orange-100"
                  />
                </label>

                <UploadZone onFilesAdded={addFiles} disabled={images.length >= MAX_IMAGES} />

                {images.length > 0 ? (
                  <div className="rounded-3xl border border-line bg-panel p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-ink">
                        Uploaded Images ({images.length}/{MAX_IMAGES})
                      </p>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Preview order
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {images.map((image) => (
                        <div
                          key={image.id}
                          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                        >
                          <img
                            src={image.url}
                            alt={image.name}
                            className="h-32 w-full object-contain p-3"
                          />
                          <div className="border-t border-slate-100 px-3 py-2 text-xs text-steel">
                            {image.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <label className="block">
                  <span className="mb-3 block text-sm font-semibold text-ink">Remarks</span>
                  <textarea
                    value={remarks}
                    onChange={(event) => setRemarks(event.target.value)}
                    placeholder="Enter Remarks"
                    rows={6}
                    className="w-full resize-y rounded-2xl border border-line bg-white px-5 py-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-orange-100"
                  />
                </label>
              </div>

              <aside className="flex h-fit flex-col gap-4 rounded-3xl border border-line bg-ink p-5 text-white">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">
                    Actions
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">Export and print</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    The buttons below use the live preview as the source, so your exported
                    document matches what you see.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={downloadPdf}
                  disabled={isExporting}
                  className="rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-wait disabled:opacity-70"
                >
                  {isExporting ? 'Generating PDF...' : 'Generate PDF'}
                </button>

                <button
                  type="button"
                  onClick={downloadPdf}
                  disabled={isExporting}
                  className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-wait disabled:opacity-70"
                >
                  Download PDF
                </button>

                <button
                  type="button"
                  onClick={printPreview}
                  className="rounded-2xl border border-white/20 bg-transparent px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Print
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-2xl border border-red-200/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-500/20"
                >
                  Clear All
                </button>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                  <p className="font-semibold text-white">Layout rules</p>
                  <p className="mt-2">1 image: full width</p>
                  <p>2 images: 2 columns</p>
                  <p>3-4 images: 2x2 grid</p>
                  <p>5-6 images: 3 columns grid</p>
                </div>
              </aside>
            </div>
          </div>
        </div>

        <section>
          <div className="print-hidden mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                Live A4 Preview
              </p>
              <p className="text-sm text-steel">
                This preview is used for both PDF generation and browser printing.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <A4Preview ref={previewRef} title={title} remarks={remarks} images={images} />
          </div>
        </section>
      </div>
    </div>
  );
}

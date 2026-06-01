import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import A4Preview from './components/A4Preview';
import UploadZone from './components/UploadZone';
import {
  A4_HEIGHT_PX,
  A4_WIDTH_PX,
  MAX_IMAGES,
  formatDisplayDate,
  formatExportDate,
  sanitizeFileSegment,
} from './utils';

function createImageItems(files, currentCount) {
  const slotsLeft = Math.max(MAX_IMAGES - currentCount, 0);

  return files.slice(0, slotsLeft).map((file) => ({
    id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
    name: file.name,
    url: URL.createObjectURL(file),
  }));
}

const initialForm = () => ({
  salesReturnNo: '',
  date: formatDisplayDate(),
  customerName: '',
  customerPhone: '',
  returnAmount: '',
  postage: '',
});

export default function App() {
  const previewRef = useRef(null);
  const imagesRef = useRef([]);
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [warning, setWarning] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, []);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const addFiles = (files) => {
    setImages((currentImages) => {
      const acceptedCount = Math.max(MAX_IMAGES - currentImages.length, 0);
      const validFiles = files.slice(0, acceptedCount);
      const nextItems = createImageItems(validFiles, currentImages.length);

      if (files.length > acceptedCount) {
        setWarning('Maximum 4 images only');
      } else {
        setWarning('');
      }

      return [...currentImages, ...nextItems];
    });
  };

  const removeImage = (imageId) => {
    setImages((currentImages) => {
      const imageToRemove = currentImages.find((image) => image.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return currentImages.filter((image) => image.id !== imageId);
    });
    setWarning('');
  };

  const clearAll = () => {
    setImages((currentImages) => {
      currentImages.forEach((image) => URL.revokeObjectURL(image.url));
      return [];
    });
    setForm(initialForm());
    setWarning('');
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
      scrollX: 0,
      scrollY: 0,
    });
  };

  const getFileName = () => {
    const sheetName = form.salesReturnNo
      ? `Sales_Return_${sanitizeFileSegment(form.salesReturnNo, 'Sales_Return')}`
      : 'Sales_Return';

    return `${sheetName}_${formatExportDate()}.pdf`;
  };

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
    window.setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="print-layout min-h-screen px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="print-hide print-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Sales Return Record Sheet Generator
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Create printable warehouse and ecommerce return records
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-steel">
                Fill in the return details, upload up to 4 evidence images, and export the
                exact A4 preview to PDF or print.
              </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-6">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-ink">
                      Sales Return No.
                    </span>
                    <input
                      type="text"
                      value={form.salesReturnNo}
                      onChange={updateField('salesReturnNo')}
                      placeholder="Enter sales return no."
                      className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-700 focus:ring-4 focus:ring-slate-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-ink">Date</span>
                    <input
                      type="date"
                      value={form.date}
                      onChange={updateField('date')}
                      className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-ink">
                      Customer Name
                    </span>
                    <input
                      type="text"
                      value={form.customerName}
                      onChange={updateField('customerName')}
                      placeholder="Enter customer name"
                      className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-700 focus:ring-4 focus:ring-slate-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-ink">
                      Customer Phone Number
                    </span>
                    <input
                      type="text"
                      value={form.customerPhone}
                      onChange={updateField('customerPhone')}
                      placeholder="Enter phone number"
                      className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-700 focus:ring-4 focus:ring-slate-100"
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink">Evidence Images</p>
                    <p className="text-sm font-semibold text-steel">{`Images: ${images.length} / 4`}</p>
                  </div>

                  <UploadZone onFilesAdded={addFiles} disabled={images.length >= MAX_IMAGES} />

                  {warning ? (
                    <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                      {warning}
                    </div>
                  ) : null}

                  {images.length > 0 ? (
                    <div className="rounded-3xl border border-line bg-panel p-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {images.map((image) => (
                          <div
                            key={image.id}
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                          >
                            <img
                              src={image.url}
                              alt={image.name}
                              className="h-40 w-full object-contain bg-white p-3"
                            />
                            <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-3 py-2">
                              <div className="min-w-0 text-xs text-steel">{image.name}</div>
                              <button
                                type="button"
                                onClick={() => removeImage(image.id)}
                                className="shrink-0 rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-ink">
                      Return Amount
                    </span>
                    <input
                      type="text"
                      value={form.returnAmount}
                      onChange={updateField('returnAmount')}
                      placeholder="Enter return amount"
                      className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-700 focus:ring-4 focus:ring-slate-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-ink">Postage</span>
                    <input
                      type="text"
                      value={form.postage}
                      onChange={updateField('postage')}
                      placeholder="Enter postage"
                      className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-700 focus:ring-4 focus:ring-slate-100"
                    />
                  </label>
                </div>
              </div>

              <aside className="flex h-fit flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">
                    Actions
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">Export and print</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Buttons stay outside the A4 sheet, so they never appear in the PDF or
                    printed document.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => document.querySelector('input[type="file"]')?.click()}
                  disabled={images.length >= MAX_IMAGES}
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Upload Images
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Clear All
                </button>

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
                  onClick={printPreview}
                  className="rounded-2xl border border-white/20 bg-transparent px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Print
                </button>

                <p className="text-xs leading-5 text-slate-300">
                  Click Print, then select your printer in the print window.
                </p>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                  <p className="font-semibold text-white">Image layout</p>
                  <p className="mt-2">1 image: full width</p>
                  <p>2 images: 2 rows</p>
                  <p>3 images: 1 large + 2 column row</p>
                  <p>4 images: 2x2 grid</p>
                </div>
              </aside>
            </div>
          </div>
        </div>

        <section className="print-preview-stage">
          <div className="print-hide print-hidden mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                Live A4 Preview
              </p>
              <p className="text-sm text-steel">
                The preview below is the exact source used for PDF generation and print.
              </p>
            </div>
          </div>

          <div className="print-preview-wrap overflow-x-auto">
            <A4Preview ref={previewRef} form={form} images={images} />
          </div>
        </section>
      </div>
    </div>
  );
}

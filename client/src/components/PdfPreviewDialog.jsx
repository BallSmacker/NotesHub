import { useEffect, useRef, useState } from "react";
import { Download, X, ZoomIn, ZoomOut } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { pdfFileUrl } from "../services/api";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfPreviewDialog({ pdf, onClose }) {
  const [numPages, setNumPages] = useState(0);
  const [visiblePages, setVisiblePages] = useState(5);
  const [scale, setScale] = useState(1);
  const [pageWidth, setPageWidth] = useState(900);
  const containerRef = useRef(null);

  const open = !!pdf;
  const url = pdf ? pdfFileUrl(pdf) : undefined;

  useEffect(() => {
    if (!pdf) return;

    setVisiblePages(5);
    setScale(1);
    setNumPages(0);

    function updateViewer() {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;
      setPageWidth(Math.min(width - 60, 950));
    }

    updateViewer();

    window.addEventListener("resize", updateViewer);

    return () => window.removeEventListener("resize", updateViewer);
  }, [pdf]);

  const zoomIn = () => setScale((s) => Math.min(s + 0.1, 2));

  const zoomOut = () => setScale((s) => Math.max(s - 0.1, 0.6));

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="h-[98vh] w-[99vw] max-w-[1600px] overflow-hidden rounded-2xl border-0 bg-zinc-950 p-0">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-5">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-white">
              {pdf?.filename?.replace(/^[0-9a-f-]+-/i, "")}
            </h2>

            <p className="truncate text-xs text-zinc-400">Preview</p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild>
              <a
                href={url}
                download={pdf?.filename?.replace(/^[0-9a-f-]+-/i, "")}
                target="_blank"
                rel="noreferrer"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>

            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </header>
        {/* PDF Container */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto bg-zinc-900 px-4 py-6"
          onScroll={(e) => {
            const target = e.currentTarget;

            const reachedBottom =
              target.scrollTop + target.clientHeight >=
              target.scrollHeight - 400;

            if (reachedBottom && visiblePages < numPages) {
              setVisiblePages((v) => Math.min(v + 5, numPages));
            }
          }}
        >
          <Document
            file={url || undefined}
            loading={
              <div className="flex h-full items-center justify-center text-zinc-400">
                Loading PDF...
              </div>
            }
            error={
              <div className="flex h-full items-center justify-center text-red-400">
                Failed to load PDF.
              </div>
            }
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
            }}
          >
            {visiblePages < numPages && (
              <div className="py-6 text-center text-sm text-zinc-400">
                Loading more pages...
              </div>
            )}
            <div className="mx-auto flex flex-col items-center gap-8 pb-10">
              {numPages > 0 &&
                Array.from(
                  { length: Math.min(visiblePages, numPages) },
                  (_, index) => (
                    <div key={index} className="rounded-xl bg-white shadow-lg">
                      <div className="flex justify-center">
                        <Page
                          pageNumber={index + 1}
                          width={pageWidth * scale}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          devicePixelRatio={2}
                          loading={null}
                        />
                      </div>
                    </div>
                  ),
                )}
            </div>
          </Document>
        </div>
        {/* Floating Zoom Controls */}
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full shadow-xl"
            onClick={zoomIn}
          >
            <ZoomIn className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            className="h-12 w-12 rounded-full shadow-xl"
            onClick={zoomOut}
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
        </div>{" "}
        {/* Floating Status */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-zinc-800/90 px-4 py-2 text-xs font-medium text-zinc-300 backdrop-blur">
          {numPages > 0
            ? `Showing ${Math.min(visiblePages, numPages)} of ${numPages} pages`
            : "Loading..."}
        </div>
      </DialogContent>
    </Dialog>
  );
}

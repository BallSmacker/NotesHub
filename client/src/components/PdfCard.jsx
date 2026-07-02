import { Download, Eye, FileText } from "lucide-react";

import { Button } from "./ui/button";
import { pdfFileUrl } from "../services/api";

export default function PdfCard({ pdf, onPreview }) {
  const name = pdf.name || pdf.title || pdf.filename || "Untitled";
  const moduleNum = pdf.module ?? pdf.moduleNumber;
  const date = pdf.uploaded_at || pdf.uploadedAt || pdf.createdAt;
  const dateStr = date ? new Date(date).toLocaleDateString() : "";

  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-primary/30">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
          <FileText className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate font-display font-semibold">{name}</div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {moduleNum != null && (
              <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium">
                Module {moduleNum}
              </span>
            )}

            {dateStr && <span>{dateStr}</span>}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 rounded-xl"
          onClick={() => onPreview(pdf)}
        >
          <Eye className="mr-1.5 h-4 w-4" />
          Preview
        </Button>

        <Button
          size="sm"
          className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          asChild
        >
          <a
            href={pdfFileUrl(pdf)}
            download={pdf.filename}
            target="_blank"
            rel="noreferrer"
          >
            <Download className="mr-1.5 h-4 w-4" />
            Download
          </a>
        </Button>
      </div>
    </div>
  );
}

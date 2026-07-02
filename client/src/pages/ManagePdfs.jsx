import { useEffect, useMemo, useState } from "react";
import { Search, FileText, Trash2, RefreshCcw, Eye } from "lucide-react";
import { toast } from "sonner";

import AdminLayout from "../components/AdminLayout";
import RequireAuth from "../components/RequireAuth";
import PdfPreviewDialog from "../components/PdfPreviewDialog";
import EmptyState from "../components/EmptyState";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

import api from "../services/api";

export default function ManagePdfs() {
  return (
    <RequireAuth>
      <AdminLayout>
        <PdfManager />
      </AdminLayout>
    </RequireAuth>
  );
}

function PdfManager() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [preview, setPreview] = useState(null);

  const [deletePdf, setDeletePdf] = useState(null);

  async function loadPdfs() {
    try {
      const res = await api.get("/pdfs");

      setPdfs(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error(err);

      toast.error("Failed to load PDFs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPdfs();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return pdfs;

    return pdfs.filter((pdf) => {
      return (
        (pdf.filename || "").toLowerCase().includes(q) ||
        (pdf.subject_name || "").toLowerCase().includes(q) ||
        (pdf.type || "").toLowerCase().includes(q)
      );
    });
  }, [pdfs, search]);

  async function removePdf() {
    if (!deletePdf) return;

    try {
      await api.delete(`/pdfs/${deletePdf.id}`);

      toast.success("PDF deleted.");

      setDeletePdf(null);

      loadPdfs();
    } catch (err) {
      console.error(err);

      toast.error(err?.response?.data?.message || "Failed to delete PDF.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black">Manage PDFs</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            View, preview, replace and delete uploaded PDFs.
          </p>
        </div>
      </div>
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search PDFs..."
          className="pl-10"
        />
      </div>{" "}
      {loading ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center text-muted-foreground">
          Loading PDFs...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No PDFs found"
          description={
            search ? "Try another search." : "Upload your first PDF."
          }
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-2xl border border-border/60 bg-card lg:block">
            <table className="w-full text-sm">
              <thead className="border-b border-border/50 bg-muted/30">
                <tr>
                  <th className="px-5 py-4 text-left">Filename</th>
                  <th className="px-5 py-4 text-left">Subject</th>
                  <th className="px-5 py-4 text-left">Type</th>
                  <th className="px-5 py-4 text-left">Module</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((pdf) => (
                  <tr
                    key={pdf.id}
                    className="border-b border-border/40 transition-colors hover:bg-muted/40 last:border-0"
                  >
                    <td className="px-5 py-4 font-medium">{pdf.filename}</td>

                    <td className="px-5 py-4">{pdf.subject_name}</td>

                    <td className="px-5 py-4">{pdf.type}</td>

                    <td className="px-5 py-4">Module {pdf.module}</td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Preview"
                          onClick={() => setPreview(pdf)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button size="icon" variant="ghost" title="Replace PDF">
                          <RefreshCcw className="h-4 w-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          title="Delete"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => setDeletePdf(pdf)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}

          <div className="grid gap-4 lg:hidden">
            {filtered.map((pdf) => (
              <div
                key={pdf.id}
                className="rounded-2xl border border-border/60 bg-card p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{pdf.filename}</h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {pdf.subject_name}
                    </p>

                    <div className="mt-3 flex gap-2 text-xs text-muted-foreground">
                      <span>{pdf.type}</span>
                      <span>•</span>
                      <span>Module {pdf.module}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setPreview(pdf)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>

                  <Button variant="secondary" size="icon">
                    <RefreshCcw className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="secondary"
                    size="icon"
                    className="text-destructive"
                    onClick={() => setDeletePdf(pdf)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}{" "}
      <PdfPreviewDialog pdf={preview} onClose={() => setPreview(null)} />
      <AlertDialog
        open={!!deletePdf}
        onOpenChange={(open) => {
          if (!open) setDeletePdf(null);
        }}
      >
        <AlertDialogContent className="max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-destructive">
              Delete PDF?
            </AlertDialogTitle>

            <AlertDialogDescription className="mt-4 leading-7 text-muted-foreground">
              You're about to permanently delete
              <span className="mx-1 font-semibold text-foreground">
                "{deletePdf?.filename}"
              </span>
              <div className="mt-5 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                This action cannot be undone.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-8">
            <AlertDialogCancel onClick={() => setDeletePdf(null)}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={removePdf}
              className="
                rounded-xl
                bg-destructive
                text-destructive-foreground
                transition-all
                duration-200
                hover:scale-105
                hover:bg-destructive/90
                active:scale-95
              "
            >
              Delete PDF
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

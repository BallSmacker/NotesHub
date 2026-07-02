import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileText, X, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import AdminLayout from "../components/AdminLayout";
import RequireAuth from "../components/RequireAuth";

import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import api from "../services/api";

export default function Upload() {
  return (
    <RequireAuth>
      <AdminLayout>
        <UploadPage />
      </AdminLayout>
    </RequireAuth>
  );
}

function UploadPage() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);

  const [subjectId, setSubjectId] = useState("");
  const [type, setType] = useState("Notes");
  const [moduleNum, setModuleNum] = useState("");
  const [name, setName] = useState("");

  const [file, setFile] = useState(null);

  const [drag, setDrag] = useState(false);

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    async function loadSubjects() {
      try {
        const res = await api.get("/subjects");

        setSubjects(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    }

    loadSubjects();
  }, []);

  function pickFile(selectedFile) {
    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      toast.error("Only PDF files are allowed.");
      return;
    }

    setFile(selectedFile);

    if (!name) {
      setName(selectedFile.name.replace(/\.pdf$/i, ""));
    }
  }

  async function submit(e) {
    e.preventDefault();

    if (!file || !subjectId || !moduleNum) {
      toast.error("Please complete all fields.");
      return;
    }

    try {
      setUploading(true);
      setDone(false);
      setProgress(0);

      const formData = new FormData();

      formData.append("pdf", file);
      formData.append("subject_id", subjectId);
      formData.append("type", type);
      formData.append("module", moduleNum);
      formData.append("name", name || file.name);

      await api.post("/pdfs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress(progressEvent) {
          if (!progressEvent.total) return;

          setProgress(
            Math.round((progressEvent.loaded * 100) / progressEvent.total),
          );
        },
      });

      setDone(true);

      toast.success("Upload complete.");

      setTimeout(() => {
        navigate("/admin");
      }, 1200);
    } catch (err) {
      console.error(err);

      toast.error(err?.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-black">Upload PDF</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Add a new note or practical.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="space-y-6 rounded-3xl border border-border/60 bg-card p-6 sm:p-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Subject</Label>

            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Choose Subject" />
              </SelectTrigger>

              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={String(subject.id)}>
                    {subject.subject_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Type</Label>

            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Notes">Notes</SelectItem>

                <SelectItem value="Practical">Practical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Module</Label>

            <Input
              type="number"
              min={1}
              value={moduleNum}
              onChange={(e) => setModuleNum(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>Display Name</Label>

            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>PDF File</Label>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              pickFile(e.dataTransfer.files[0]);
            }}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
              drag
                ? "border-primary bg-primary/5"
                : "border-border/60 hover:border-primary/40 hover:bg-muted/40"
            }`}
          >
            {file ? (
              <div className="flex w-full max-w-md items-center gap-3 rounded-xl bg-muted p-3">
                <FileText className="h-6 w-6 text-primary" />

                <div className="flex-1 text-left">
                  <div className="truncate text-sm font-medium">
                    {file.name}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary">
                  <UploadCloud className="h-7 w-7" />
                </div>

                <div>
                  <div className="font-medium">Click or Drag PDF</div>

                  <div className="text-xs text-muted-foreground">
                    PDF up to 50MB
                  </div>
                </div>
              </>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => pickFile(e.target.files[0])}
            />
          </div>
        </div>

        {(uploading || done) && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{done ? "Complete" : "Uploading..."}</span>

              <span>{progress}%</span>
            </div>

            <Progress value={progress} />
          </div>
        )}

        <Button
          type="submit"
          disabled={uploading}
          className="h-11 w-full rounded-xl"
        >
          {done ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Uploaded
            </>
          ) : uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload PDF
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

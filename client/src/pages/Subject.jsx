import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, FlaskConical } from "lucide-react";

import StudentLayout from "../components/StudentLayout";
import PdfCard from "../components/PdfCard";
import PdfPreviewDialog from "../components/PdfPreviewDialog";
import EmptyState from "../components/EmptyState";
import { CardSkeleton } from "../components/Loading";

import api from "../services/api";

export default function Subject() {
  const { id } = useParams();

  const [subject, setSubject] = useState(null);
  const [pdfs, setPdfs] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [subjectRes, pdfRes] = await Promise.all([
          api.get("/subjects"),
          api.get(`/pdfs/subject/${id}`),
        ]);

        const subjectList = Array.isArray(subjectRes.data)
          ? subjectRes.data
          : subjectRes.data.data || [];

        const pdfList = Array.isArray(pdfRes.data)
          ? pdfRes.data
          : pdfRes.data.data || [];

        setSubject(
          subjectList.find((s) => String(s.id) === String(id)) || null,
        );

        setPdfs(pdfList);
      } catch (err) {
        console.error(err);
        setPdfs([]);
      }
    }

    fetchData();
  }, [id]);

  const { notes, practicals } = useMemo(() => {
    const notes = [];
    const practicals = [];

    (pdfs || []).forEach((pdf) => {
      const type = String(pdf.type ?? pdf.kind ?? "notes").toLowerCase();

      if (type.startsWith("prac")) {
        practicals.push(pdf);
      } else {
        notes.push(pdf);
      }
    });

    return { notes, practicals };
  }, [pdfs]);

  return (
    <StudentLayout>
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-accent">
          Subject
        </div>

        <h1 className="mt-1 font-display text-3xl font-black sm:text-4xl">
          {subject?.subject_name || "Subject"}
        </h1>
      </div>

      <Section
        icon={<FileText className="h-5 w-5" />}
        title="Notes"
        count={notes.length}
      >
        {pdfs === null ? (
          <CardSkeleton count={3} />
        ) : notes.length === 0 ? (
          <EmptyState title="No notes yet" />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((pdf) => (
              <PdfCard key={pdf.id} pdf={pdf} onPreview={setPreview} />
            ))}
          </div>
        )}
      </Section>

      <Section
        icon={<FlaskConical className="h-5 w-5" />}
        title="Practicals"
        count={practicals.length}
      >
        {pdfs === null ? (
          <CardSkeleton count={3} />
        ) : practicals.length === 0 ? (
          <EmptyState title="No practicals yet" />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {practicals.map((pdf) => (
              <PdfCard key={pdf.id} pdf={pdf} onPreview={setPreview} />
            ))}
          </div>
        )}
      </Section>

      <PdfPreviewDialog pdf={preview} onClose={() => setPreview(null)} />
    </StudentLayout>
  );
}

function Section({ icon, title, count, children }) {
  return (
    <section className="mt-10 first:mt-0">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary">
          {icon}
        </div>

        <h2 className="font-display text-xl font-bold">{title}</h2>

        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {count}
        </span>
      </div>

      {children}
    </section>
  );
}

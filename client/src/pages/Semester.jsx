import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import StudentLayout from "../components/StudentLayout";
import SubjectCard from "../components/SubjectCard";
import SearchBar from "../components/SearchBar";
import EmptyState from "../components/EmptyState";
import { CardSkeleton } from "../components/Loading";

import api from "../services/api";

export default function Semester() {
  const [subjects, setSubjects] = useState([]);
  const suggestions = subjects.map((s) => s.subject_name);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [subjectsRes, pdfsRes] = await Promise.all([
          api.get("/subjects"),
          api.get("/pdfs"),
        ]);

        const subjectsData = Array.isArray(subjectsRes.data)
          ? subjectsRes.data
          : subjectsRes.data.data || [];

        const pdfsData = Array.isArray(pdfsRes.data)
          ? pdfsRes.data
          : pdfsRes.data.data || [];

        setSubjects(subjectsData);
        setPdfs(pdfsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredSubjects = useMemo(() => {
    const ql = search.trim().toLowerCase();

    return ql
      ? subjects.filter((s) =>
          (s.subject_name || "").toLowerCase().includes(ql),
        )
      : subjects;
  }, [subjects, search]);

  const getNotesCount = (subjectId) => {
    return pdfs.filter(
      (pdf) => String(pdf.subjectId ?? pdf.subject_id) === String(subjectId),
    ).length;
  };

  return (
    <StudentLayout>
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="mb-6">
        <div className="text-xs uppercase tracking-widest text-primary">
          Semester 3
        </div>

        <h1 className="mt-1 font-display text-3xl font-black sm:text-4xl">
          Subjects
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Choose a subject to view notes and practicals.
        </p>
      </div>

      <div className="mb-6 max-w-xl">
        <SearchBar
          value={search}
          onChange={setSearch}
          suggestions={suggestions}
        />
      </div>

      {loading && <CardSkeleton />}

      {!loading && filteredSubjects.length === 0 && (
        <EmptyState
          title="No subjects here yet"
          description="Nothing has been added to this semester."
        />
      )}

      {!loading && filteredSubjects.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              id={subject.id}
              name={subject.subject_name}
              notesCount={getNotesCount(subject.id)}
            />
          ))}
        </div>
      )}
    </StudentLayout>
  );
}

import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";

import StudentLayout from "../components/StudentLayout";
import SearchBar from "../components/SearchBar";
import SubjectCard from "../components/SubjectCard";
import EmptyState from "../components/EmptyState";
import { CardSkeleton } from "../components/Loading";

import api from "../services/api";

export default function Search() {
  const [params] = useSearchParams();
  const initial = params.get("q") || "";

  const [search, setSearch] = useState(initial);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/subjects");
        setSubjects(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return subjects;
    return subjects.filter((s) =>
      (s.subject_name || "").toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, subjects]);

  return (
    <StudentLayout>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft size={18} />
        Back
      </Link>

      <h1 className="mb-2 font-display text-4xl font-bold">Search Subjects</h1>

      <p className="mb-6 text-muted-foreground">Find a subject quickly.</p>

      <div className="mb-8 max-w-xl">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search subjects..."
        />
      </div>

      {loading ? (
        <CardSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState title="Nothing found" description="Try another search." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((subject) => (
            <SubjectCard
              key={subject.id}
              id={subject.id}
              name={subject.subject_name}
              notesCount="-"
            />
          ))}
        </div>
      )}
    </StudentLayout>
  );
}

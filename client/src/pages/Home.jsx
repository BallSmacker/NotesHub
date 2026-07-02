import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, BookOpen, FileDown, ShieldCheck } from "lucide-react";

import StudentLayout from "../components/StudentLayout";
import StudentFooter from "../components/StudentFooter";

import SearchBar from "../components/SearchBar";
import SemesterCard from "../components/SemesterCard";
import EmptyState from "../components/EmptyState";
import { CardSkeleton } from "../components/Loading";

import api from "../services/api";

export default function Home() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const suggestions = subjects.map((s) => s.subject_name);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const res = await api.get("/subjects");

        const data = Array.isArray(res.data) ? res.data : res.data.data || [];

        setSubjects(data);
      } catch (err) {
        console.error(err);
        setError("Couldn't connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchSubjects();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <StudentLayout>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 p-6 sm:p-10">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--gradient-primary)" }}
        />

        <div
          className="pointer-events-none absolute -left-10 bottom-0 h-56 w-56 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--gradient-accent)" }}
        />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Study smarter. Download instantly.
          </div>

          <h1 className="mt-4 font-display text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            Everything you need
            <br />
            <span className="text-gradient-primary">for your semester.</span>
          </h1>

          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            Browse subjects, preview notes and practicals, then download them
            instantly.
          </p>

          <form onSubmit={handleSearch} className="mt-6 max-w-2xl">
            <SearchBar
              value={search}
              onChange={setSearch}
              suggestions={suggestions}
            />
          </form>

          <div className="mt-8 grid grid-cols-3 gap-3 sm:max-w-lg">
            {[
              { icon: BookOpen, label: "Subjects" },
              { icon: FileDown, label: "Downloads" },
              { icon: ShieldCheck, label: "Verified" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-start gap-2 rounded-2xl border border-border/40 bg-background/40 p-3 text-xs"
              >
                <item.icon className="h-4 w-4 text-primary" />
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Semester */}
      <section className="mt-10">
        <div className="mb-4">
          <h2 className="font-display text-2xl font-bold">Semester</h2>

          <p className="text-sm text-muted-foreground">
            Open your current semester.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <SemesterCard
            id="3"
            name="Semester 3"
            subjectsCount={subjects.length}
          />
        </div>
      </section>

      <StudentFooter />
    </StudentLayout>
  );
}

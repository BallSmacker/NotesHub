import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap } from "lucide-react";

export default function SemesterCard({ id, name, subjectsCount }) {
  return (
    <Link
      to={`/semester/${id}`}
      className="group relative block overflow-hidden rounded-3xl border border-border/60 bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-glow)]"
    >
      <div
        className="absolute inset-x-0 -top-24 h-40 opacity-40 blur-3xl transition-opacity group-hover:opacity-70"
        style={{ background: "var(--gradient-primary)" }}
      />

      <div className="relative flex items-start justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary">
          <GraduationCap className="h-6 w-6" />
        </div>

        <ArrowRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
      </div>

      <div className="relative mt-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          Semester
        </div>

        <div className="mt-1 font-display text-2xl font-extrabold">{name}</div>

        {typeof subjectsCount === "number" && (
          <div className="mt-2 text-sm text-muted-foreground">
            {subjectsCount} {subjectsCount === 1 ? "subject" : "subjects"}
          </div>
        )}
      </div>
    </Link>
  );
}

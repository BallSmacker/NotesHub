import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";

export default function SubjectCard({ id, name, notesCount }) {
  return (
    <Link
      to={`/subject/${id}`}
      className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card/80"
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
        <BookOpen className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate font-display text-base font-semibold">
          {name}
        </div>

        <div className="mt-0.5 text-xs text-muted-foreground">
          {notesCount ?? 0} {notesCount === 1 ? "note" : "notes"}
        </div>
      </div>

      <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
    </Link>
  );
}

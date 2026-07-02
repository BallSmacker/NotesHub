import Logo from "./Logo";

export default function StudentFooter() {
  return (
    <footer className="mt-16 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
      <div className="flex flex-col items-center gap-3">
        <Logo size={28} />

        <p>Your notes. Organized. Built for students.</p>

        <p className="text-xs">© {new Date().getFullYear()} NotesHub</p>
      </div>
    </footer>
  );
}

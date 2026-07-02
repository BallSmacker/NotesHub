import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function SearchBar({
  value,
  onChange,
  placeholder,
  suggestions = [],
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (value) return;
    if (suggestions.length === 0) return;

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % suggestions.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [value, suggestions]);

  const animatedPlaceholder =
    placeholder ||
    (suggestions.length ? `Search "${suggestions[index]}"...` : "Search...");

  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={animatedPlaceholder}
        className="h-12 w-full rounded-2xl border border-border/60 bg-card pl-12 pr-4 text-base shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}

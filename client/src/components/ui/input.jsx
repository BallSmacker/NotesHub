export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary ${className}`}
      {...props}
    />
  );
}

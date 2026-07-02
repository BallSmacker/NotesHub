import { cloneElement, isValidElement } from "react";

export function Button({
  children,
  className = "",
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default: "bg-primary text-primary-foreground hover:opacity-90",
    secondary: "bg-muted hover:bg-muted/80",
    ghost: "hover:bg-muted",
    destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 text-sm",
    icon: "h-10 w-10",
  };

  const classes = `${base} ${variants[variant] || ""} ${
    sizes[size] || ""
  } ${className}`;

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      className: `${classes} ${children.props.className || ""}`,
      ...props,
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

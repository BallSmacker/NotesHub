import { useState } from "react";

export function Select({ value, onValueChange, children }) {
  const options = [];

  function walk(nodes) {
    if (!nodes) return;

    if (Array.isArray(nodes)) {
      nodes.forEach(walk);
      return;
    }

    if (nodes.type === SelectContent) {
      walk(nodes.props.children);
      return;
    }

    if (nodes.type === SelectItem) {
      options.push(nodes.props);
    }
  }

  walk(children);

  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="h-11 w-full rounded-lg border border-border bg-background px-3"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.children}
        </option>
      ))}
    </select>
  );
}

export function SelectTrigger({ children }) {
  return children;
}

export function SelectValue({ placeholder }) {
  return placeholder;
}

export function SelectContent({ children }) {
  return children;
}

export function SelectItem({ children }) {
  return children;
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface InlineEditCellProps {
  value: string | number;
  onSave: (value: string) => void;
  type?: "text" | "number";
  suffix?: string;
  className?: string;
}

export function InlineEditCell({
  value,
  onSave,
  type = "text",
  suffix,
  className = "",
}: InlineEditCellProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSave = () => {
    setEditing(false);
    if (editValue !== String(value)) {
      onSave(editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditValue(String(value));
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <Input
        ref={inputRef}
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="h-7 w-full text-sm"
        step={type === "number" ? "0.01" : undefined}
      />
    );
  }

  return (
    <span
      className={`cursor-pointer hover:bg-primary/5 px-1.5 py-0.5 rounded transition-colors ${className}`}
      onClick={() => {
        setEditValue(String(value));
        setEditing(true);
      }}
      title="Klicken zum Bearbeiten"
    >
      {type === "number" ? Number(value).toLocaleString("de-AT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}
      {suffix && ` ${suffix}`}
    </span>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => onChange(local), 300);
    return () => clearTimeout(timer);
  }, [local, onChange]);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  return (
    <Input
      placeholder="Search by hospital name, ID, or district..."
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      className="w-full sm:max-w-md rounded-xl"
    />
  );
}

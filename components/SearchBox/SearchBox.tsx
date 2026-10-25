'use client';

import css from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className={css.searchBox}>
      <input
        type="text"
        placeholder="Search notes..."
        value={value}
        onChange={onChange}
        className={css.input}
      />
    </div>
  );
}
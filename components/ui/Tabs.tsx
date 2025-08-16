import React from 'react';

interface TabsProps<T extends string> {
  options: { value: T; label: string, icon?: React.ReactNode }[];
  active: T;
  onSelect: (value: T) => void;
}

export function Tabs<T extends string>({ options, active, onSelect }: TabsProps<T>) {
  return (
    <div className="w-full flex p-1 bg-black/10 dark:bg-white/10 rounded-lg overflow-x-auto">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`w-full flex-shrink-0 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
            active === option.value
              ? 'bg-white/80 dark:bg-gray-900/60 text-blue-600 dark:text-blue-400 shadow'
              : 'text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10'
          }`}
          aria-pressed={active === option.value}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}
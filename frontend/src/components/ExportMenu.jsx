import { useState, useRef, useEffect } from 'react';
import { Download, FileJson, FileSpreadsheet, FileText } from 'lucide-react';
import { exportToCSV, exportToJSON, exportToMarkdown } from '../utils/exportUtils';

export default function ExportMenu({ trips }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (!trips || trips.length === 0) return null;

  const options = [
    { label: 'Export as CSV', icon: FileSpreadsheet, action: () => exportToCSV(trips) },
    { label: 'Export as JSON', icon: FileJson, action: () => exportToJSON(trips) },
    { label: 'Export as Markdown', icon: FileText, action: () => exportToMarkdown(trips) },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg glass-tile-strong text-white font-semibold text-sm hover:bg-white/20 transition-colors text-shadow-soft"
      >
        <Download size={16} /> Export all trips
      </button>

      {open && (
        <div className="absolute right-0 mt-1 bg-card border border-ink/10 rounded-lg shadow-lg overflow-hidden z-10 w-52">
          {options.map(({ label, icon: Icon, action }) => (
            <button
              key={label}
              onClick={() => {
                action();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-paper text-left"
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

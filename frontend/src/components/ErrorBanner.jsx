import { AlertTriangle, WifiOff, X } from 'lucide-react';

export default function ErrorBanner({ message, onDismiss, variant = 'error' }) {
  if (!message) return null;

  const isOffline = !navigator.onLine;
  const Icon = isOffline ? WifiOff : AlertTriangle;

  const styles = {
    error: 'glass-tile-strong border-accentAlert/50 text-white',
    warning: 'glass-tile-strong border-sun/50 text-white',
  };

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${styles[variant]} mb-4`}>
      <Icon size={18} className="mt-0.5 flex-shrink-0 text-accentAlert" strokeWidth={2.5} />
      <p className="text-sm font-medium flex-1 text-shadow-soft">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="flex-shrink-0 hover:opacity-70">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

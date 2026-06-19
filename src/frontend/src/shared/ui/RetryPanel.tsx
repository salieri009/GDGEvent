interface RetryPanelProps {
  message: string;
  onRetry: () => void;
  className?: string;
}

export default function RetryPanel({ message, onRetry, className = 'p-48' }: RetryPanelProps) {
  return (
    <div className={`${className} text-center space-y-6`}>
      <p className="text-2xl font-black uppercase text-red-700">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="px-8 py-4 bg-primary border-4 border-slate-border rounded-2xl font-black uppercase shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
      >
        Try Again
      </button>
    </div>
  );
}

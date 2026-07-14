import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onCreateTask?: () => void;
}

export default function Header({ title, subtitle, onCreateTask }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur border-b border-slate-200">
      <div className="h-16 px-4 md:px-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={() => (onCreateTask ? onCreateTask() : navigate("/tasks"))}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Task
        </button>
      </div>
    </header>
  );
}

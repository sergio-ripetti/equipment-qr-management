import { useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export interface ToastProps {
  message: string;
  duration?: number;
  onDismiss: () => void;
}

export default function Toast({ message, duration = 2000, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-md flex items-center gap-3">
        <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-green-600" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}

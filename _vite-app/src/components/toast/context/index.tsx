import { createContext, useRef, useState, type ReactNode } from "react";

// TODO(fase-3f): portar o componente visual real (ToastZRO) de
// br.thp.zr0/src/components/toast — este placeholder só mantém a API
// (showToast) para não bloquear o resto do esqueleto.
export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

interface IToastProvider {
  children: ReactNode;
}

export const ToastProvider: React.FC<IToastProvider> = ({ children }) => {
  const [toast, setToast] = useState<Toast | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const showToast: ToastContextType["showToast"] = (message, type, duration = 3000) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setToast({ message, type });

    timeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div role="status" style={{ position: "fixed", bottom: 16, right: 16 }}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};

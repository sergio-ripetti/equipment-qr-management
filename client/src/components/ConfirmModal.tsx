import ActionButton from "./ActionButton";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "secondary"
    | "outline";
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>

        <p className="text-gray-500 mt-3">{message}</p>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-6">
          <ActionButton variant="outline" onClick={onCancel}>
            {cancelText}
          </ActionButton>

          <ActionButton variant={variant} onClick={onConfirm}>
            {confirmText}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

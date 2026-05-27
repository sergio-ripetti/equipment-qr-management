type EmptyStateProps = {
  title: string;
  message?: string;
};

export default function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-8 text-center">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

      {message && <p className="text-gray-500 text-sm mt-2">{message}</p>}
    </div>
  );
}

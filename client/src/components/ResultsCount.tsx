type ResultsCountProps = {
  count: number;
  singularLabel: string;
  pluralLabel: string;
};

export default function ResultsCount({
  count,
  singularLabel,
  pluralLabel,
}: ResultsCountProps) {
  return (
    <p className="text-sm text-gray-500 mb-5">
      Showing {count} {count === 1 ? singularLabel : pluralLabel}
    </p>
  );
}

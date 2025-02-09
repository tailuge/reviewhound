
import ReactMarkdown from "react-markdown";

interface ReviewContentProps {
  error: string | null;
  review: string;
}

export const ReviewContent = ({ error, review }: ReviewContentProps) => {
  return (
    <div className="flex-1 overflow-auto p-4 font-mono text-sm">
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <ReactMarkdown className="prose prose-invert max-w-none">
          {review}
        </ReactMarkdown>
      )}
    </div>
  );
};

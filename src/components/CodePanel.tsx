import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface CodePanelProps {
  code?: string;
}

export const CodePanel = ({ code }: CodePanelProps) => {
  const [showComments, setShowComments] = useState(false);

  if (!code) {
    return (
      <div className="flex items-center justify-center h-full text-vscode-text/50">
        Select a file to review
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-vscode-border">
        <span className="text-sm">main.tsx</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="text-vscode-text hover:text-white"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Comments
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <pre className="p-4 font-mono text-sm">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
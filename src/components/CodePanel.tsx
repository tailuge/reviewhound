import { Button } from "@/components/ui/button";

interface CodePanelProps {
  code?: string;
}

export const CodePanel = ({ code }: CodePanelProps) => {
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
      </div>
      <div className="flex-1 overflow-auto">
        <pre className="p-4 font-mono text-sm">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
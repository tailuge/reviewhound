
import { Button } from "@/components/ui/button";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";
import { useEffect, useRef } from "react";

interface CodePanelProps {
  code?: string;
}

export const CodePanel = ({ code }: CodePanelProps) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (code && codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  if (!code) {
    return (
      <div className="flex items-center justify-center h-full text-vscode-text/50">
        Select a file to review
      </div>
    );
  }

  // Determine language based on file extension (can be expanded)
  const getLanguage = (code: string) => {
    if (code.includes('import') || code.includes('export')) {
      return 'typescript';
    }
    try {
      JSON.parse(code);
      return 'json';
    } catch {
      return 'typescript';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-vscode-border">
        <span className="text-sm">main.tsx</span>
      </div>
      <div className="flex-1 overflow-auto">
        <pre className="p-4">
          <code
            ref={codeRef}
            className={`language-${getLanguage(code)}`}
          >
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

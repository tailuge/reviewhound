import { useState } from "react";
import { TreeView } from "@/components/TreeView";
import { CodePanel } from "@/components/CodePanel";
import { ResizablePanel } from "@/components/ResizablePanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const sampleData = [
  {
    name: "src",
    type: "folder" as const,
    children: [
      { name: "main.tsx", type: "file" as const },
      { name: "App.tsx", type: "file" as const },
      {
        name: "components",
        type: "folder" as const,
        children: [
          { name: "Button.tsx", type: "file" as const },
          { name: "Input.tsx", type: "file" as const },
        ],
      },
    ],
  },
  {
    name: "public",
    type: "folder" as const,
    children: [
      { name: "index.html", type: "file" as const },
      { name: "styles.css", type: "file" as const },
    ],
  },
];

const sampleCode = `import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);`;

const Index = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement GitHub repo fetching
    console.log("Fetching repo:", repoUrl);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-vscode-bg border-b border-vscode-border p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-4">
          <Input
            type="text"
            placeholder="Enter GitHub repository URL"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="flex-1 bg-vscode-active border-vscode-border text-vscode-text"
          />
          <Button type="submit" className="bg-vscode-blue hover:bg-vscode-blue/90">
            <Github className="w-4 h-4 mr-2" />
            Load Repository
          </Button>
        </form>
      </header>

      <main className="flex-1 overflow-hidden">
        <ResizablePanel
          left={
            <TreeView
              data={sampleData}
              onSelect={(item) => setSelectedFile(item.name)}
            />
          }
          right={<CodePanel code={selectedFile ? sampleCode : undefined} />}
        />
      </main>

      <footer className="bg-vscode-bg border-t border-vscode-border p-4 text-sm text-vscode-text/60">
        <div className="max-w-3xl mx-auto text-center">
          <a href="https://github.com" className="hover:text-vscode-text" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          {" • "}
          <a href="https://icons8.com" className="hover:text-vscode-text" target="_blank" rel="noopener noreferrer">
            Icons8
          </a>
          {" • "}
          <a href="https://idx.dev" className="hover:text-vscode-text" target="_blank" rel="noopener noreferrer">
            IDX
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
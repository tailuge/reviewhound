import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

interface RepoHeaderProps {
  repoUrl: string;
  onRepoUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const RepoHeader = ({ repoUrl, onRepoUrlChange, onSubmit, isLoading }: RepoHeaderProps) => (
  <header className="bg-vscode-bg border-b border-vscode-border p-4">
    <form onSubmit={onSubmit} className="max-w-3xl mx-auto flex gap-4">
      <Input
        type="text"
        placeholder="Enter GitHub repository URL"
        value={repoUrl}
        onChange={(e) => onRepoUrlChange(e.target.value)}
        className="flex-1 bg-vscode-active border-vscode-border text-vscode-text"
      />
      <Button 
        type="submit" 
        className="bg-vscode-blue hover:bg-vscode-blue/90"
        disabled={isLoading}
      >
        <Github className="w-4 h-4 mr-2" />
        {isLoading ? "Loading..." : "Load Repository"}
      </Button>
    </form>
  </header>
);
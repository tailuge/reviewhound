import { useState } from "react";
import { TreeView } from "@/components/TreeView";
import { CodePanel } from "@/components/CodePanel";
import { ResizablePanel } from "@/components/ResizablePanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { fetchRepoTree } from "@/utils/github";
import { useToast } from "@/components/ui/use-toast";

interface TreeItem {
  name: string;
  type: "file" | "folder";
  children?: TreeItem[];
}

const Index = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [treeData, setTreeData] = useState<TreeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) {
      toast({
        title: "Error",
        description: "Please enter a GitHub repository URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const tree = await fetchRepoTree(repoUrl);
      setTreeData(tree);
      toast({
        title: "Success",
        description: "Repository loaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load repository. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

      <main className="flex-1 overflow-hidden">
        <ResizablePanel
          left={
            <TreeView
              data={treeData}
              onSelect={(item) => setSelectedFile(item.name)}
            />
          }
          right={<CodePanel code={selectedFile ? selectedFile : undefined} />}
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
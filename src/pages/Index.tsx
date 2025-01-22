import { useState } from "react";
import { TreeView } from "@/components/TreeView";
import { CodePanel } from "@/components/CodePanel";
import { ResizablePanel } from "@/components/ResizablePanel";
import { RepoHeader } from "@/components/RepoHeader";
import { Terminal } from "@/components/Terminal";
import { fetchRepoTree, fetchFileContent } from "@/utils/github";
import { useToast } from "@/components/ui/use-toast";

interface TreeItem {
  name: string;
  type: "file" | "folder";
  children?: TreeItem[];
  path?: string;
  content?: string;
}

const DEFAULT_REPO = "https://github.com/tailuge/codorebyu";

const Index = () => {
  const [repoUrl, setRepoUrl] = useState(DEFAULT_REPO);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
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

  const handleFileSelect = async (item: TreeItem) => {
    if (item.type === "file" && item.path) {
      setIsLoading(true);
      try {
        const content = await fetchFileContent(repoUrl, item.path);
        setSelectedFile(item.name);
        setFileContent(content);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load file content",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <RepoHeader
        repoUrl={repoUrl}
        onRepoUrlChange={setRepoUrl}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 min-h-0">
          <ResizablePanel
            left={
              <div className="h-full overflow-auto">
                <TreeView
                  data={treeData}
                  onSelect={handleFileSelect}
                />
              </div>
            }
            right={<CodePanel code={fileContent || undefined} />}
          />
        </div>
        <Terminal codeContent={fileContent || ""} />
      </main>
    </div>
  );
};

export default Index;
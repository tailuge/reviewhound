import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VendorSelect } from "./terminal/VendorSelect";
import { ModelSelect } from "./terminal/ModelSelect";
import { LLMServiceFactory } from "@/services/llm/factory";
import { LLMVendor, OpenAIModel } from "@/types/llm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";

interface TerminalProps {
  codeContent?: string;
}

export const Terminal = ({ codeContent }: TerminalProps) => {
  const [selectedVendor, setSelectedVendor] = useState<LLMVendor>("openai");
  const [selectedModel, setSelectedModel] = useState<OpenAIModel>("gpt-4o");
  const [apiKey, setApiKey] = useState("");
  const [review, setReview] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleReview = async () => {
    if (!codeContent) {
      const errorMessage = "Code content is required";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    if (selectedVendor !== "free" && !apiKey) {
      const errorMessage = "API key is required";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      if (selectedVendor === "free") {
        console.log('Calling free code review function');
        const { data, error: functionError } = await supabase.functions.invoke('free-code-review', {
          body: { code: codeContent }
        });

        if (functionError) throw new Error(functionError.message);
        if (data.error) throw new Error(data.error);
        
        console.log('Received response from free code review:', data);
        setReview(data.review);
      } else {
        const response = await LLMServiceFactory.reviewCode({
          code: codeContent,
          apiKey,
          vendor: selectedVendor,
          model: selectedModel,
        });

        if (response.error) {
          throw new Error(response.error);
        }

        setReview(response.review);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to review code";
      console.error("Error during code review:", error);
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResizablePanelGroup
      direction="vertical"
      className="fixed bottom-0 left-0 right-0"
      style={{ height: '20vh', minHeight: '100px', maxHeight: '80vh' }}
    >
      <ResizableHandle />
      <ResizablePanel defaultSize={100}>
        <div className="h-full bg-vscode-bg border-t border-vscode-border flex flex-col">
          <div className="flex items-center justify-between p-2 border-b border-vscode-border">
            <div className="flex items-center gap-4">
              <VendorSelect value={selectedVendor} onChange={setSelectedVendor} />
              {selectedVendor === "openai" && (
                <ModelSelect value={selectedModel} onChange={setSelectedModel} />
              )}
              {selectedVendor !== "free" && (
                <Input
                  type="password"
                  placeholder="Enter API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-[240px]"
                />
              )}
            </div>
            <div className="space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReview}
                disabled={isLoading || (!apiKey && selectedVendor !== "free")}
                className="text-vscode-text hover:text-white"
              >
                {isLoading ? "Reviewing..." : "Review"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => console.log('Apply clicked')}
                className="text-vscode-text hover:text-white"
              >
                Apply
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-sm">
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <ReactMarkdown className="prose prose-invert max-w-none">
                {review}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
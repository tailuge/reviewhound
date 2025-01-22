import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VendorSelect } from "./terminal/VendorSelect";
import { ModelSelect } from "./terminal/ModelSelect";
import { LLMServiceFactory } from "@/services/llm/factory";
import { LLMVendor, OpenAIModel } from "@/types/llm";
import { useToast } from "@/hooks/use-toast";

interface TerminalProps {
  codeContent?: string;
}

export const Terminal = ({ codeContent }: TerminalProps) => {
  const [selectedVendor, setSelectedVendor] = useState<LLMVendor>("openai");
  const [selectedModel, setSelectedModel] = useState<OpenAIModel>("gpt-4o");
  const [apiKey, setApiKey] = useState("");
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleReview = async () => {
    if (!apiKey || !codeContent) {
      toast({
        title: "Error",
        description: "API key and code content are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
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
    } catch (error) {
      console.error("Error during code review:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to review code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-vscode-bg border-t border-vscode-border h-[200px] flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-vscode-border">
        <div className="flex items-center gap-4">
          <VendorSelect value={selectedVendor} onChange={setSelectedVendor} />
          {selectedVendor === "openai" && (
            <ModelSelect value={selectedModel} onChange={setSelectedModel} />
          )}
          <Input
            type="password"
            placeholder="Enter API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-[240px]"
          />
        </div>
        <div className="space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReview}
            disabled={isLoading || !apiKey}
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
      <div className="flex-1 overflow-auto p-4 font-mono text-sm whitespace-pre-wrap">
        {review}
      </div>
    </div>
  );
};
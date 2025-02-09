
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VendorSelect } from "./terminal/VendorSelect";
import { ModelSelect } from "./terminal/ModelSelect";
import { LLMServiceFactory } from "@/services/llm/factory";
import { LLMVendor, OpenAIModel } from "@/types/llm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { Cog } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface TerminalProps {
  codeContent?: string;
}

const DEFAULT_PROMPT = `Please review this code and provide feedback on potential improvements, bugs, and best practices:

CODE:
{code}

Focus on:
1. Code quality and readability
2. Performance optimizations
3. Security concerns
4. Best practices
5. Potential bugs
6. Architecture improvements

Please provide specific, actionable feedback.`;

export const Terminal = ({ codeContent }: TerminalProps) => {
  const [selectedVendor, setSelectedVendor] = useState<LLMVendor>("free");
  const [selectedModel, setSelectedModel] = useState<OpenAIModel>("gpt-4o");
  const [apiKey, setApiKey] = useState("");
  const [review, setReview] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
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
          body: { 
            code: codeContent,
            filePath: selectedFile || 'unknown',
            prompt: prompt.replace('{code}', codeContent)
          }
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
          prompt: prompt.replace('{code}', codeContent)
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

  const handleApply = async () => {
    if (!codeContent || !review) {
      const errorMessage = "Both code and review are required";
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
      console.log('Calling apply code changes function');
      const { data, error: functionError } = await supabase.functions.invoke('apply-code-changes', {
        body: { 
          code: codeContent,
          review,
          filePath: selectedFile || 'unknown'
        }
      });

      if (functionError) throw new Error(functionError.message);
      if (data.error) throw new Error(data.error);
      
      console.log('Received response from apply code changes:', data);
      setReview(data.modifiedCode);
      toast({
        title: "Success",
        description: "Code changes applied successfully",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to apply code changes";
      console.error("Error applying code changes:", error);
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

  const handleResetPrompt = () => {
    setPrompt(DEFAULT_PROMPT);
    toast({
      title: "Success",
      description: "Prompt reset to default",
    });
  };

  return (
    <div className="h-full flex flex-col bg-vscode-bg border-t border-vscode-border">
      <div className="flex-none p-2 border-b border-vscode-border">
        <div className="flex items-center justify-between">
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
          <div className="space-x-2 flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-vscode-text hover:text-white"
                >
                  <Cog className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Review Settings</SheetTitle>
                  <SheetDescription>
                    Customize the prompt used for code review. Use {'{code}'} as a placeholder for the code content.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                    placeholder="Enter your custom prompt..."
                  />
                  <Button
                    onClick={handleResetPrompt}
                    variant="outline"
                    className="w-full"
                  >
                    Reset to Default
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
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
              onClick={handleApply}
              disabled={isLoading || !review}
              className="text-vscode-text hover:text-white"
            >
              {isLoading ? "Applying..." : "Apply"}
            </Button>
          </div>
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
  );
};

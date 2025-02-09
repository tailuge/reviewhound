
import { useState, useEffect } from "react";
import { LLMServiceFactory } from "@/services/llm/factory";
import { LLMVendor, OpenAIModel, GeminiModel } from "@/types/llm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TerminalHeader } from "./terminal/TerminalHeader";
import { ReviewContent } from "./terminal/ReviewContent";
import { Search } from "lucide-react";

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

const LOCAL_STORAGE_PROMPT_KEY = 'code-review-prompt';
const LOCAL_STORAGE_CONTEXT_REGEXP_KEY = 'code-review-context-regexp';
const LOCAL_STORAGE_MODEL_KEY = 'code-review-model';
const DEFAULT_MODEL: GeminiModel = "gemini-2.0-flash";

export const Terminal = ({ codeContent }: TerminalProps) => {
  const [selectedVendor, setSelectedVendor] = useState<LLMVendor>("free");
  const [selectedModel, setSelectedModel] = useState<OpenAIModel>("gpt-4o");
  const [selectedGeminiModel, setSelectedGeminiModel] = useState<GeminiModel>(DEFAULT_MODEL);
  const [apiKey, setApiKey] = useState("");
  const [review, setReview] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [contextRegexp, setContextRegexp] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedPrompt = localStorage.getItem(LOCAL_STORAGE_PROMPT_KEY);
    const savedContextRegexp = localStorage.getItem(LOCAL_STORAGE_CONTEXT_REGEXP_KEY);
    const savedModel = localStorage.getItem(LOCAL_STORAGE_MODEL_KEY) as GeminiModel;
    
    if (savedPrompt) setPrompt(savedPrompt);
    if (savedContextRegexp) setContextRegexp(savedContextRegexp);
    if (savedModel) setSelectedGeminiModel(savedModel);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PROMPT_KEY, prompt);
  }, [prompt]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CONTEXT_REGEXP_KEY, contextRegexp);
  }, [contextRegexp]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_MODEL_KEY, selectedGeminiModel);
  }, [selectedGeminiModel]);

  const handleContextClick = () => {
    console.log('Current context regexp:', contextRegexp);
  };

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
            prompt: prompt.replace('{code}', codeContent),
            model: selectedGeminiModel
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
    localStorage.setItem(LOCAL_STORAGE_PROMPT_KEY, DEFAULT_PROMPT);
    toast({
      title: "Success",
      description: "Prompt reset to default",
    });
  };

  return (
    <div className="h-full flex flex-col bg-vscode-bg border-t border-vscode-border">
      <TerminalHeader
        selectedVendor={selectedVendor}
        selectedModel={selectedModel}
        selectedGeminiModel={selectedGeminiModel}
        apiKey={apiKey}
        prompt={prompt}
        contextRegexp={contextRegexp}
        isLoading={isLoading}
        hasReview={Boolean(review)}
        onVendorChange={setSelectedVendor}
        onModelChange={setSelectedModel}
        onGeminiModelChange={setSelectedGeminiModel}
        onApiKeyChange={setApiKey}
        onPromptChange={setPrompt}
        onContextRegexpChange={setContextRegexp}
        onResetPrompt={handleResetPrompt}
        onReview={handleReview}
        onContextClick={handleContextClick}
        onApply={handleApply}
      />
      <ReviewContent error={error} review={review} />
    </div>
  );
};

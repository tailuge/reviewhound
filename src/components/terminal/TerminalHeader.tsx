
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VendorSelect } from "./VendorSelect";
import { ModelSelect } from "./ModelSelect";
import { LLMVendor, OpenAIModel, GeminiModel } from "@/types/llm";
import { SettingsPanel } from "./SettingsPanel";
import { Search } from "lucide-react";

interface TerminalHeaderProps {
  selectedVendor: LLMVendor;
  selectedModel: OpenAIModel;
  selectedGeminiModel: GeminiModel;
  apiKey: string;
  prompt: string;
  contextRegexp: string;
  isLoading: boolean;
  hasReview: boolean;
  onVendorChange: (vendor: LLMVendor) => void;
  onModelChange: (model: OpenAIModel) => void;
  onGeminiModelChange: (model: GeminiModel) => void;
  onApiKeyChange: (key: string) => void;
  onPromptChange: (prompt: string) => void;
  onContextRegexpChange: (regexp: string) => void;
  onResetPrompt: () => void;
  onReview: () => void;
  onContextClick: () => void;
  onApply: () => void;
}

export const TerminalHeader = ({
  selectedVendor,
  selectedModel,
  selectedGeminiModel,
  apiKey,
  prompt,
  contextRegexp,
  isLoading,
  hasReview,
  onVendorChange,
  onModelChange,
  onGeminiModelChange,
  onApiKeyChange,
  onPromptChange,
  onContextRegexpChange,
  onResetPrompt,
  onReview,
  onContextClick,
  onApply,
}: TerminalHeaderProps) => {
  return (
    <div className="flex-none p-2 border-b border-vscode-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <VendorSelect value={selectedVendor} onChange={onVendorChange} />
          {selectedVendor === "openai" && (
            <ModelSelect value={selectedModel} onChange={onModelChange} />
          )}
          {selectedVendor !== "free" && (
            <Input
              type="password"
              placeholder="Enter API Key"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              className="w-[240px]"
            />
          )}
        </div>
        <div className="space-x-2 flex items-center">
          <SettingsPanel
            prompt={prompt}
            contextRegexp={contextRegexp}
            selectedModel={selectedGeminiModel}
            onPromptChange={onPromptChange}
            onContextRegexpChange={onContextRegexpChange}
            onModelChange={onGeminiModelChange}
            onResetPrompt={onResetPrompt}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onContextClick}
            className="text-vscode-text hover:text-white"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReview}
            disabled={isLoading || (!apiKey && selectedVendor !== "free")}
            className="text-vscode-text hover:text-white"
          >
            {isLoading ? "Reviewing..." : "Review"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onApply}
            disabled={isLoading || !hasReview}
            className="text-vscode-text hover:text-white"
          >
            {isLoading ? "Applying..." : "Apply"}
          </Button>
        </div>
      </div>
    </div>
  );
};

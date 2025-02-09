
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VendorSelect } from "./VendorSelect";
import { ModelSelect } from "./ModelSelect";
import { LLMVendor, OpenAIModel } from "@/types/llm";
import { SettingsPanel } from "./SettingsPanel";

interface TerminalHeaderProps {
  selectedVendor: LLMVendor;
  selectedModel: OpenAIModel;
  apiKey: string;
  prompt: string;
  isLoading: boolean;
  hasReview: boolean;
  onVendorChange: (vendor: LLMVendor) => void;
  onModelChange: (model: OpenAIModel) => void;
  onApiKeyChange: (key: string) => void;
  onPromptChange: (prompt: string) => void;
  onResetPrompt: () => void;
  onReview: () => void;
  onApply: () => void;
}

export const TerminalHeader = ({
  selectedVendor,
  selectedModel,
  apiKey,
  prompt,
  isLoading,
  hasReview,
  onVendorChange,
  onModelChange,
  onApiKeyChange,
  onPromptChange,
  onResetPrompt,
  onReview,
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
            onPromptChange={onPromptChange}
            onResetPrompt={onResetPrompt}
          />
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

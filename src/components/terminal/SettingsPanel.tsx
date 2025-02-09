
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cog } from "lucide-react";
import { GeminiModel } from "@/types/llm";

interface SettingsPanelProps {
  prompt: string;
  contextRegexp: string;
  selectedModel: GeminiModel;
  onPromptChange: (value: string) => void;
  onContextRegexpChange: (value: string) => void;
  onModelChange: (value: GeminiModel) => void;
  onResetPrompt: () => void;
}

const geminiModels: GeminiModel[] = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro",
  "gemini-2.0-flash",
  "gemini-2.0-flash-exp",
  "gemini-2.0-flash-lite-preview-02-05",
  "gemini-2.0-flash-thinking-exp-01-21",
  "gemini-2.0-pro-exp-02-05",
  "gemma-2-27b-it",
  "gemma-2-2b-it",
  "gemma-2-9b-it"
];

export const SettingsPanel = ({ 
  prompt, 
  contextRegexp,
  selectedModel,
  onPromptChange, 
  onContextRegexpChange,
  onModelChange,
  onResetPrompt 
}: SettingsPanelProps) => {
  return (
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
            Customize the settings for code review
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>Model</Label>
            <Select value={selectedModel} onValueChange={onModelChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {geminiModels.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Context RegExp</Label>
            <Input
              value={contextRegexp}
              onChange={(e) => onContextRegexpChange(e.target.value)}
              placeholder="Enter regexp for context..."
            />
          </div>

          <div className="space-y-2">
            <Label>Review Prompt</Label>
            <Textarea
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Enter your custom prompt..."
            />
          </div>

          <Button
            onClick={onResetPrompt}
            variant="outline"
            className="w-full"
          >
            Reset to Default
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

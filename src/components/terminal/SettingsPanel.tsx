
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Cog } from "lucide-react";

interface SettingsPanelProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onResetPrompt: () => void;
}

export const SettingsPanel = ({ prompt, onPromptChange, onResetPrompt }: SettingsPanelProps) => {
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
            Customize the prompt used for code review. Use {'{code}'} as a placeholder for the code content.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
            placeholder="Enter your custom prompt..."
          />
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

import { Button } from "@/components/ui/button";

export const Terminal = () => {
  return (
    <div className="bg-vscode-bg border-t border-vscode-border h-[200px] flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-vscode-border">
        <span className="text-sm">Terminal</span>
        <div className="space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log('Review clicked')}
            className="text-vscode-text hover:text-white"
          >
            Review
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
        {/* Terminal output will go here */}
      </div>
    </div>
  );
};